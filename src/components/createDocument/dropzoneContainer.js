import { Component } from "react";
import PropTypes from "prop-types";
import { issueDocuments } from "@govtechsg/tradetrust-schema";
import { get } from "lodash";

/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { getData } from "@govtechsg/open-attestation";
import FileSaver from "file-saver";

import HashColor from "../UI/HashColor";
import PdfDropzone from "./pdfDropzone";
import { BlueButton, CustomButton } from "../UI/Button";
import Input from "../UI/Input";
import { createBaseDocument, isValidAddress } from "../utils";
import DocumentList from "./documentList";
import Dropdown from "../UI/Dropdown";
import { getLogger } from "../../logger";
import STORE_ADDR from "./store";
import {
  getDocumentQueueNumber,
  updateDocument
} from "../../services/documentStore";
import { SHARE_LINK_API_URL } from "../../config";

const JSZip = require("jszip");

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
      issuerName: STORE_ADDR[0].label,
      documentStore: STORE_ADDR[0].value,
      formError: false,
      batchError: "",
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
    documents.push({ id, title: "Untitled", attachments: [] });
    this.setState({ documents, activeDoc: id });
  };

  onDocumentFileChange = (data, pdfName, docId) => {
    trace(`updated document id ${docId}`);
    const { documents, docIdx } = this.findDocumentIndex(docId);
    documents[docIdx].attachments.push({
      filename: pdfName,
      type: "application/pdf",
      data
    });
    this.setState({ documents, formError: false });
  };

  toggleDropzoneView = id => this.setState({ activeDoc: id });

  onEditTitle = id => this.setState({ editableDoc: id });

  onBatchClick = async () => {
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

      const urlReservations = await Promise.all(
        documents.map(() => getDocumentQueueNumber())
      );

      trace(urlReservations);

      const unSignedData = documents.map((doc, idx) => {
        const baseDoc = this.generateBaseDoc(doc.title, urlReservations[idx]);
        baseDoc.attachments = doc.attachments;
        return baseDoc;
      });

      const signedDoc = this.handleIssueDocuments(unSignedData);
      this.publishDocuments(signedDoc);
      this.setState({ signedDoc });
      await this.uploadPublishedDocuments();
    } catch (e) {
      error(e);
    }
  };

  uploadPublishedDocuments = async () => {
    const { signedDoc } = this.state;
    const response = await Promise.all(
      signedDoc.map(doc => {
        const url = get(doc, "data.documentUrl");
        const splitUrl = decodeURIComponent(url)
          .split("#")[0]
          .split("/");
        return updateDocument(doc, splitUrl[splitUrl.length - 1]);
      })
    );
    this.setState({
      signedDoc,
      creatingDocument: false,
      batchError: ""
    });
    if (response.find(val => !val)) {
      this.setState({
        batchError: "Documents issued but failed to upload"
      });
    }
  };

  generateBaseDoc = (title, { id: documentId, key: decryptionKey }) => {
    const { issuerName, documentStore } = this.state;
    const baseDoc = createBaseDocument();
    const metaObj = {
      name: issuerName,
      documentStore,
      identityProof: { type: "DNS-TXT", location: "stanchart.tradetrust.io" }
    };
    baseDoc.issuers.push(metaObj);
    baseDoc.name = title;
    const url = encodeURIComponent(
      JSON.stringify({
        uri: `${SHARE_LINK_API_URL}/${documentId}#${decryptionKey}`
      })
    );
    baseDoc.documentUrl = `tradetrust://${url}`;
    return baseDoc;
  };

  handleIssueDocuments = rawJson => {
    try {
      return issueDocuments(rawJson);
    } catch (e) {
      throw new Error("Invalid document");
    }
  };

  onInputFieldChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onDropdownChange = e => {
    const addrValue = STORE_ADDR.find(addr => addr.value === e.target.value);
    this.setState({
      issuerName: addrValue.label,
      documentStore: e.target.value
    });
  };

  publishDocuments = signedDoc => {
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
    const { documents, docIdx } = this.findDocumentIndex(docId);
    documents[docIdx].title = title;
    this.setState({ documents });
  };

  deletePdf = (pdfName, docId) => {
    const { documents, docIdx } = this.findDocumentIndex(docId);
    const pdfIdx = documents[docIdx].attachments.findIndex(
      pdf => pdf.filename === pdfName
    );
    documents[docIdx].attachments.splice(pdfIdx, 1);
    this.setState({ documents });
  };

  deleteDoc = docId => {
    const { documents, docIdx } = this.findDocumentIndex(docId);
    documents.splice(docIdx, 1);
    this.setState({ documents });
  };

  findDocumentIndex = docId => {
    const documents = JSON.parse(JSON.stringify(this.state.documents));
    const docIdx = documents.findIndex(doc => doc.id === docId);
    return { documents, docIdx };
  };

  downloadAllDocuments = () => {
    const zip = new JSZip();
    this.state.signedDoc.forEach(doc => {
      const docData = getData(doc);
      const title = `${get(docData, "name")}.tt`;
      zip.file(title, JSON.stringify(doc));
    });
    zip
      .generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6
        }
      })
      .then(content => {
        try {
          FileSaver.saveAs(content, "documents.zip");
        } catch (e) {
          error(e);
        }
      });
  };

  resetForm = () => {
    this.setState({
      issuerName: STORE_ADDR[0].label,
      documentStore: STORE_ADDR[0].value,
      formError: false,
      fileError: false,
      activeDoc: 0,
      documents: [],
      editableDoc: 0,
      creatingDocument: false,
      signedDoc: []
    });
  };

  render() {
    const {
      creatingDocument,
      documentStore,
      documents,
      signedDoc,
      formError,
      activeDoc,
      editableDoc,
      batchError
    } = this.state;
    const { issuedTx, networkId, issuingError } = this.props;

    return (
      <>
        <div className="mt4" css={css(formStyle)}>
          <div className="flex flex-row w-100 mb4">
            <div className="fl w-100 mr5 ml4">
              <div className="mb4">
                <div className="fl w-50 pr2">
                  <span className="silver fw6">Issuer Name</span>
                  <Dropdown
                    options={STORE_ADDR}
                    value={documentStore}
                    handleChange={this.onDropdownChange}
                  />
                </div>
                <div className="fl w-50 pl2">
                  <span className="silver fw6">Document Store</span>
                  <Input
                    id="store"
                    className="fr ba b--light-blue mt2"
                    name="documentStore"
                    variant="rounded"
                    type="text"
                    borderColor="#96ccff"
                    placeholder="Enter ethereum address"
                    value={documentStore}
                    readOnly={true}
                    size={50}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mb4">
            <div className="mb4 mr5 ml4 gray fw6 f4">
              For each trade transaction, create a new record. Then add the
              relevent files to the record.
              <a
                onClick={this.resetForm}
                className="ml2 f5 light-blue underline pointer"
              >
                Reset All{" "}
              </a>
            </div>
            <div className="mb4 ml4">
              <PdfDropzone
                documents={documents}
                isError={formError}
                activeDoc={activeDoc}
                editableDoc={editableDoc}
                toggleDropzoneView={this.toggleDropzoneView}
                updateTitle={this.updateTitle}
                deletePdf={this.deletePdf}
                onEditTitle={this.onEditTitle}
                deleteDoc={this.deleteDoc}
                onDocumentFileChange={this.onDocumentFileChange}
              />
            </div>
            <div className="mr5 ml4">
              <CustomButton onClick={this.createDocument}>
                <i className="fa fa-plus mr2" />
                Click to create a new record
              </CustomButton>
            </div>
          </div>
          {signedDoc.length > 0 && (
            <DocumentList
              downloadDocuments={this.downloadAllDocuments}
              signedDocuments={signedDoc}
            />
          )}
          {issuedTx && !creatingDocument ? (
            <div className="mb4 mr5 ml4">
              <p>🎉 Batch has been issued.</p>
              <div>
                Transaction ID{" "}
                <HashColor hashee={issuedTx} networkId={networkId} isTx />
              </div>
            </div>
          ) : null}
          {((!issuedTx && issuingError) || batchError) && (
            <div className="mb4 mr5 ml4 light-red">
              <p>{issuingError || batchError}</p>
            </div>
          )}
          {documents.length > 0 && (
            <div className="left-0 bottom-0 right-0 mw8-ns mw9 mr5 ml4">
              <BlueButton
                variant="rounded"
                onClick={this.onBatchClick}
                style={{
                  width: "100%",
                  height: 80,
                  fontSize: 25,
                  fonrWeight: 600,
                  margin: 0
                }}
                disabled={this.props.issuingDocument}
              >
                {this.props.issuingDocument ? "Issuing…" : "Issue all records"}
              </BlueButton>
            </div>
          )}
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
  issuingDocument: PropTypes.bool,
  issuingError: PropTypes.object
};
