import { Component } from "react";
import PropTypes from "prop-types";
import { issueDocuments } from "@govtechsg/tradetrust-schema";
import { groupBy, get } from "lodash";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
const uuidv4 = require('uuid/v4');

import HashColor from "../UI/HashColor";
import DocumentDropzone from "./documentDropzone";
import PdfDropzone from "./pdfDropzone";
import { BlueButton, CustomButton } from "../UI/Button";
import Input from "../UI/Input";
import { createBaseDocument, isValidAddress, uploadFile } from "../utils";
import DocumentList from "./documentList";
import { invalidColor } from "../../styles/variables";
import Dropdown from "../UI/Dropdown";
import { getLogger } from "../../logger";
import { STORE_ADDR } from "./store";
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

const dropZoneStyle = css`
  overflow: scroll;
`;

class DropzoneContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issuerName: STORE_ADDR[0]["label"],
      documentStore: STORE_ADDR[0]["value"],
      formError: false,
      fileError: false,
      activeDoc: 0,
      documents: [],
      editableDoc: 0,
      creatingDocument: false,
      signedDoc: []
    };
  }

  handleFileError = () => this.setState({ fileError: true });

  createDocument = () => {
    const documents = JSON.parse(JSON.stringify(this.state.documents));
    const id = new Date().getTime();
    documents.push({id, title: "Untitled", attachments: []});
    console.log(documents)
    this.setState({documents, activeDoc: id});
  }

  onDocumentFileChange = (data, pdfName, docId) => {
    const documents = JSON.parse(JSON.stringify(this.state.documents));
    trace(`updated document id ${docId}`);

    const index = documents.findIndex(doc =>  doc.id == docId);

    documents[index].attachments.push({filename: pdfName, type: "application/pdf", data});

    this.setState({documents, formError: false});
  };

  toggleDropzoneView = (id) => {
    console.log(id)
    this.setState({activeDoc: id});
  }

  onEditTitle = (id) => {
    this.setState({editableDoc: id})
  }

  onBatchClick = () => {
    try {
      const { documents, issuerName, documentStore } = this.state;
      const noAttachments = documents.find(doc => doc.attachments.length === 0);
      if (
        !issuerName ||
        !documentStore ||
        !isValidAddress(documentStore) ||
        noAttachments
      ) {
        this.setState({ formError: true });
        return;
      }
      this.setState({ creatingDocument: true, formError: false });

      const unSignedData = documents.map(doc => {
        const baseDoc = this.generateBaseDoc();
        baseDoc.attachments = doc.attachments;
        return baseDoc;
      });
      const signedDoc = this.issueDocuments(unSignedData);
      this.onIssueClick(signedDoc);
      Promise.all(signedDoc.map(doc => uploadFile(doc)))
        .then(res => { 
          res.filter((val, idx) => { if(!val) signedDoc.splice(idx, 1); });
          this.setState({ signedDoc, creatingDocument: false });
        });
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
    baseDoc.documentUrl = "/" + uuidv4() + "/demo.tt";
    return baseDoc;
  };

  issueDocuments = rawJson => {
    try {
      return issueDocuments(rawJson);
    } catch (e) {
      throw new Error("Invalid document");
    }
  };

  onInputFieldChange = e => {
    console.log(e.target.value)
    const addrValue = STORE_ADDR.find(addr => addr.value === e.target.value);
    console.log(addrValue)
    this.setState({ issuerName: addrValue.label, documentStore: e.target.value });
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

  onIssueClick = (signedDoc) => {
    const { adminAddress, handleDocumentIssue } = this.props;
    const { documentStore } = this.state;
    const documentHash = `0x${get(signedDoc, "[0].signature.merkleRoot")}`;
    handleDocumentIssue({
      storeAddress: documentStore,
      fromAddress: adminAddress,
      documentHash
    });
  };

  updateTitle = (title, docId) => {
    const documents = JSON.parse(JSON.stringify(this.state.documents));
    const index = documents.findIndex(doc =>  doc.id == docId);
    documents[index].title = title;

    this.setState({documents});
  }

  deletePdf = (pdfName, docId) => {
    const documents = JSON.parse(JSON.stringify(this.state.documents));
    const docIdx = documents.findIndex(doc =>  doc.id == docId);
    const pdfIdx = documents[docIdx].attachments.findIndex(pdf =>  pdf.filename === pdfName);
    documents[docIdx].attachments.splice(pdfIdx, 1);

    this.setState({documents});
  }

  render() {
    const {
      creatingDocument,
      issuerName,
      documentStore,
      documents,
      signedDoc,
      formError,
      fileError,
      activeDoc,
      editableDoc
    } = this.state;
    console.log(documents)
    const { issuedTx, networkId } = this.props;
    return (
      <>
        <div css={css(formStyle)}>
        <div className="flex flex-row w-100 mb4">
          <div className="fl w-100">
            <div className="mb4">
              <div className="fl w-50 pr2">
                Issuer Name
                <Dropdown options={STORE_ADDR} value={documentStore} handleChange={this.onInputFieldChange} />
              </div>
              <div className="fl w-50 pl2">
                Document Store
                <Input
                  id="store"
                  className="fr ba b--light-blue"
                  name="documentStore"
                  variant="rounded"
                  type="text"
                  borderColor="#96ccff"
                  placeholder="Enter ethereum address"
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
        </div>
        <div className="mb4">
        <div className="mb4">
        For each trade transaction, create a new record. Then add the relevent files to the record.
        </div>
        <div className="mb4" css={css(dropZoneStyle)}>
            <PdfDropzone
              documents={documents}
              error={formError}
              activeDoc={activeDoc}
              editableDoc={editableDoc}
              toggleDropzoneView={this.toggleDropzoneView}
              updateTitle={this.updateTitle}
              deletePdf={this.deletePdf}
              onEditTitle={this.onEditTitle}
              onDocumentFileChange={this.onDocumentFileChange}
            />
          </div>    
        <CustomButton onClick={this.createDocument}>Click to create a new record</CustomButton>
        </div>
          {signedDoc.length > 0 && (
            <div style={{ display: "flex" }}>
              <DocumentList signedDocuments={signedDoc} />
            </div>
          )}
          {issuedTx && !creatingDocument ? (
            <div className="mt5">
              <p>🎉 Batch has been issued.</p>
              <div>
                Transaction ID{" "}
                <HashColor hashee={issuedTx} networkId={networkId} isTx />
              </div>
            </div>
          ) : null}
          <div className="left-0 bottom-0 right-0 mw8-ns center mw9">
            <BlueButton
              variant="rounded"
              onClick={this.onBatchClick}
              style={{width: "100%", height: 80, fontSize: 25, fonrWeight: 600, margin: 0}}
              disabled={creatingDocument}
            >
              {creatingDocument ? "Issuing…" : "Issue all records"}
            </BlueButton>
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
