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
import Dropdown from "../UI/Dropdown";

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
    const idValue = +docId || +documentId + 1;
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

      const groupDocuments = groupBy(documents, "id");
      const unSignedData = Object.keys(groupDocuments).map(docId => {
        const baseDoc = this.generateBaseDoc();
        return this.batchPdf(baseDoc, groupDocuments[docId]);
      });
      const signedDoc = this.issueDocuments(unSignedData);
      this.setState({ signedDoc, creatingDocument: false });
    } catch (e) {
      error(e);
    }
  };

  generateBaseDoc = () => {
    const { issuerName, documentStore } = this.state;
    const baseDoc = createBaseDocument();
    const metaObj = {
      name: issuerName,
      documentStore,
      identityProof: { type: "DNS-TXT", location: "stanchart.tradetrust.io" }
    };
    baseDoc.issuers.push(metaObj);
    return baseDoc;
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
        <div className="flex flex-row w-100 mb4">
          <div className="fl w-70">
            <div className="mb4">
              <div className="fl w-30">
                Issuer Name
            </div>
              <div className="fl w-70 mb4">
                <Dropdown options={[{ label: "hellow", value: 2 }, { label: "lets eseee", value: 3 }]} value={2} handleChange={this.onInputFieldChange} />
              </div>
            </div>
            <div className="mb2">
              <div className="fl w-30">
                Document Store
              </div>
              <div className="fr fl w-70">
                <Input
                  id="store"
                  className="fr ba b--light-blue"
                  name="documentStore"
                  variant="rounded"
                  type="text"
                  borderColor="#96ccff"
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
            </div>
          </div>
          <div className="fl w-30 mr2">
            <OrangeButton
              variant="rounded"
              onClick={this.onIssueClick}
              disabled={issuingDocument || signedDoc.length === 0}
            >
              {issuingDocument ? "Issuing…" : "Issue All Documents"}
            </OrangeButton>
          </div>
        </div>
          <div className="mb4">
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
          {/* <div style={{ textAlign: "center" }}>
            <OrangeButton
              variant="pill"
              className="mt4"
              onClick={this.onBatchClick}
              disabled={creatingDocument}
            >
              {creatingDocument ? "Creating..." : "Create Document"}
            </OrangeButton>

          </div> */}
          <div className="mb4">
            <PdfDropzone
              documents={groupDocuments}
              onDocumentFileChange={this.onDocumentFileChange}
            />
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
