import React, { Component } from "react";
import { issueDocument } from "@govtechsg/tradetrust-schema";
import { groupBy } from "lodash";

import DocumentDropzone from "./documentDropzone";
import PdfDropzone from "./pdfDropzone";
import { OrangeButton } from "../UI/Button";
import Input from "../UI/Input";

class DropzoneContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issuerName: "",
      documentStore: "",
      orgUrl: "",
      fileError: false,
      documentId: 0,
      metaData: [],
      documents: [],
      batchingDocument: false
    };
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileError = this.handleFileError.bind(this);
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
    const { documents, file } = this.state;
    const updatedFile = JSON.parse(JSON.stringify(file));
    if (!file.attachments) {
      updatedFile.attachments = [];
    }
    const attachmentLength = updatedFile.attachments.length;

    documents.forEach((doc, index) => {
      let keyIndex = index;
      if (attachmentLength > index) {
        keyIndex = attachmentLength + index;
      }

      updatedFile.attachments[keyIndex] = {
        filename: "",
        type: "application/pdf",
        data: null
      };

      updatedFile.attachments[keyIndex].filename = doc.name;
      updatedFile.attachments[keyIndex].data = doc.value;
    });
    try {
      const signedDocument = issueDocument(updatedFile, "1.0");
      console.log(signedDocument);
    } catch (e) {
      console.log(e);
    }

    this.setState({ file: updatedFile });
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
