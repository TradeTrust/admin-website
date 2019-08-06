import React, { Component } from "react";
import { issueDocument } from "@govtechsg/tradetrust-schema";
import { groupBy } from "lodash";

import DocumentDropzone from "./documentDropzone";
import PdfDropzone from "./pdfDropzone";
import { OrangeButton } from "../UI/Button";
import Input from "../UI/Input";
import {createBaseDocument} from "../utils";

class DropzoneContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issuerName: "",
      documentStore: "",
      orgUrl: "",
      fileError: false,
      documentId: 0,
      documents: [],
      batchingDocument: false
    };
  }

  handleFileError = () => {};

  onDocumentFileChange = (data, docName, docId = false) => {
    const documents = JSON.parse(JSON.stringify(this.state.documents));
    const { documentId } = this.state;
    const idValue = docId || documentId + 1;

    documents.push({ value: data, name: docName, id: idValue });
    this.setState({ documents, documentId: documentId + 1 });
  };

  onBatchClick = () => {
    const { documents, issuerName, documentStore, orgUrl} = this.state;
    const baseDoc = createBaseDocument();
    const metaObj = {name: issuerName, documentStore, identityProof: { type: "DNS-TXT", location: orgUrl}};
    baseDoc["issuers"].push(metaObj);
    baseDoc["$template"]["url"]= "abc.com"
    if (!baseDoc.attachments) {
      baseDoc.attachments = [];
    }
    const attachmentLength = baseDoc.attachments.length;

    documents.forEach((doc, index) => {
      let keyIndex = index;
      if (attachmentLength > index) {
        keyIndex = attachmentLength + index;
      }

      baseDoc.attachments[keyIndex] = {
        filename: "",
        type: "application/pdf",
        data: null
      };

      baseDoc.attachments[keyIndex].filename = doc.name;
      baseDoc.attachments[keyIndex].data = doc.value;
    });
    try {
      const signedDocument = issueDocument(baseDoc, "1.0");
      console.log(signedDocument);
    } catch (e) {
      console.log(e);
    }

  };

  onInputFieldChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const {
      batchingDocument,
      issuerName,
      documentStore,
      orgUrl,
      documents
    } = this.state;
    const groupDocuments = groupBy(documents, "id");
    return (
      <div>
        <div className="mb2">
          Issuer Name
          <br />
          <Input
            className="mt2"
            name="issuerName"
            variant="pill"
            type="text"
            placeholder="Name of organization"
            onChange={this.onInputFieldChange}
            value={issuerName}
            message={""}
            size={50}
            required
          />
        </div>
        <div className="mb2">
          Document Store
          <br />
          <Input
            className="mt2"
            name="documentStore"
            variant="pill"
            type="text"
            placeholder="Ether ethereum address"
            onChange={this.onInputFieldChange}
            value={documentStore}
            message={documentStore}
            size={50}
            required
          />
        </div>
        <div className="mb4">
          Organization Url
          <br />
          <Input
            className="mt2"
            name="orgUrl"
            variant="pill"
            type="text"
            placeholder="Url of the organization"
            onChange={this.onInputFieldChange}
            value={orgUrl}
            message={""}
            size={50}
            required
          />
        </div>
        <div className="mb4">
          <DocumentDropzone onDocumentFileChange={this.onDocumentFileChange} />
        </div>
        <div className="mb4">
          <PdfDropzone
            documents={groupDocuments}
            onDocumentFileChange={this.onDocumentFileChange}
          />
        </div>
        <OrangeButton
          variant="pill"
          className="mt4"
          onClick={this.onBatchClick}
          disabled={batchingDocument}
        >
          {batchingDocument ? "Batching…" : "Batch Document"}
        </OrangeButton>
      </div>
    );
  }
}

export default DropzoneContainer;
