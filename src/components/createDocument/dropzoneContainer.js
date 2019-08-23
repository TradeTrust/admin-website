import { Component } from "react";
import PropTypes from "prop-types";
import { issueDocuments } from "@govtechsg/tradetrust-schema";
import { groupBy, get } from "lodash";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";

import HashColor from "../UI/HashColor";
import DocumentDropzone from "./documentDropzone";
import PdfDropzone from "./pdfDropzone";
import { OrangeButton } from "../UI/Button";
import Input from "../UI/Input";
import { createBaseDocument, isValidAddress } from "../utils";
import DocumentList from "./documentList";
import { invalidColor } from "../../styles/variables";

import { getLogger } from "../../logger";

const { trace, error } = getLogger("services:dropzoneContainer");

const formStyle = css`
  background-color: white;
  border-radius: 3px;
  border: none;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
  display: block;
  max-width: 1080px;
  padding: 3rem;
`;

class DropzoneContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issuerName: "",
      documentStore: "",
      formError: false,
      fileError: false,
      documentId: 0,
      documents: [],
      creatingDocument: false,
      signedDoc: []
    };
  }

  handleFileError = () => this.setState({ fileError: true });

  onDocumentFileChange = (data, docName, docId = false) => {
    const documents = JSON.parse(JSON.stringify(this.state.documents));
    const { documentId } = this.state;

    trace(`created document id  ${documentId}`);
    const idValue = docId || documentId + 1;
    trace(`updated document id ${docId}`);

    documents.push({ value: data, name: docName, id: idValue });
    const stateObj = docId
      ? { documents, fileError: false }
      : { documents, documentId: documentId + 1, fileError: false };
    this.setState(stateObj);
  };

  onBatchClick = () => {
    try {
      const { documents, issuerName, documentStore } = this.state;
      if (
        !issuerName ||
        !documentStore ||
        !isValidAddress(documentStore) ||
        documents.length === 0
      ) {
        this.setState({ formError: true });
        return;
      }
      this.setState({ creatingDocument: true, formError: false });
      const baseDoc = createBaseDocument();
      const metaObj = {
        name: issuerName,
        documentStore,
        identityProof: { type: "DNS-TXT", location: "stanchart.tradetrust.io" }
      };
      baseDoc.issuers.push(metaObj);

      const groupDocuments = groupBy(documents, "id");
      const unSignedData = Object.keys(groupDocuments).map(docId =>
        this.batchPdf(baseDoc, groupDocuments[docId])
      );
      const signedDoc = this.issueDocuments(unSignedData);
      this.setState({ signedDoc, creatingDocument: false });
    } catch (e) {
      error(e);
    }
  };

  batchPdf = (baseDoc, docs) => {
    const jsonDoc = baseDoc;
    jsonDoc.attachments = docs.map(doc => ({
      filename: doc.name,
      type: "application/pdf",
      data: doc.value
    }));
    return jsonDoc;
  };

  issueDocuments = rawJson => {
    try {
      return issueDocuments(rawJson);
    } catch (e) {
      throw new Error("Invalid document");
    }
  };

  onInputFieldChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getErrorMessage = (formError, fieldValue, fieldName) => {
    if (
      formError &&
      fieldValue &&
      fieldName === "documentStore" &&
      !isValidAddress(fieldValue)
    )
      return "Enter valid store address";
    return formError && !fieldValue ? "This field is required" : "";
  };

  resetForm = () =>
    this.setState({
      formError: false,
      fileError: false,
      documentId: 0,
      documents: [],
      creatingDocument: false,
      signedDoc: []
    });

  onIssueClick = () => {
    const { adminAddress, handleDocumentIssue } = this.props;
    const { documentStore, signedDoc } = this.state;
    const documentHash = `0x${get(signedDoc, "[0].signature.merkleRoot")}`;
    handleDocumentIssue({
      storeAddress: documentStore,
      fromAddress: adminAddress,
      documentHash
    });
  };

  render() {
    const {
      creatingDocument,
      issuerName,
      documentStore,
      documents,
      signedDoc,
      formError,
      fileError
    } = this.state;
    const { issuedTx, networkId, issuingDocument } = this.props;
    const groupDocuments = groupBy(documents, "id");
    return (
      <>
        <div css={css(formStyle)}>
          <div className="mb2">
            Issuer Name
            <br />
            <Input
              id="issuer"
              className="mt2"
              name="issuerName"
              variant="pill"
              type="text"
              placeholder="Name of organization"
              onChange={this.onInputFieldChange}
              value={issuerName}
              message={this.getErrorMessage(formError, issuerName)}
              size={50}
              required
            />
          </div>
          <div className="mb2">
            Document Store
            <br />
            <Input
              id="store"
              className="mt2"
              name="documentStore"
              variant="pill"
              type="text"
              placeholder="Enter ethereum address"
              onChange={this.onInputFieldChange}
              value={documentStore}
              message={this.getErrorMessage(
                formError,
                documentStore,
                "documentStore"
              )}
              size={50}
              required
            />
          </div>
          <div className="mb4">
            <h3> Drag and drop pdf file to create new document</h3>
            <br />
            <DocumentDropzone
              onDocumentFileChange={this.onDocumentFileChange}
              error={fileError}
              handleFileError={this.handleFileError}
            />
            {formError && documents.length === 0 && (
              <small style={{ color: invalidColor }}>
                Attachments required
              </small>
            )}
          </div>
          <div className="mb4">
            <PdfDropzone
              documents={groupDocuments}
              onDocumentFileChange={this.onDocumentFileChange}
            />
          </div>
          {signedDoc.length > 0 && (
            <div style={{ display: "flex" }}>
              <DocumentList signedDocuments={signedDoc} />
            </div>
          )}
          {issuedTx && !issuingDocument ? (
            <div className="mt5">
              <p>🎉 Batch has been issued.</p>
              <div>
                Transaction ID{" "}
                <HashColor hashee={issuedTx} networkId={networkId} isTx />
              </div>
            </div>
          ) : null}
          <div style={{ textAlign: "center" }}>
            <OrangeButton
              variant="pill"
              className="mt4"
              onClick={this.onBatchClick}
              disabled={creatingDocument}
            >
              {creatingDocument ? "Creating..." : "Create Document"}
            </OrangeButton>
            <OrangeButton
              variant="pill"
              className="mt4"
              onClick={this.onIssueClick}
              disabled={issuingDocument || signedDoc.length === 0}
            >
              {issuingDocument ? "Issuing…" : "Issue Document"}
            </OrangeButton>
          </div>
        </div>
      </>
    );
  }
}

export default DropzoneContainer;

DropzoneContainer.propTypes = {
  adminAddress: PropTypes.string,
  handleDocumentIssue: PropTypes.func,
  issuedTx: PropTypes.string,
  networkId: PropTypes.number,
  issuingDocument: PropTypes.bool
};
