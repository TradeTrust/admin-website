import React, { Component } from "react";
import { issueDocument } from "@govtechsg/tradetrust-schema";
import { groupBy } from "lodash";

import DocumentDropzone from "./documentDropzone";
import PdfDropzone from "./pdfDropzone";
import { OrangeButton } from "../UI/Button";
import Input from "../UI/Input";
import { createBaseDocument } from "../utils";
import DocumentList from "./documentList";

class DropzoneContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issuerName: "",
      documentStore: "",
      templateUrl: "",
      orgUrl: "",
      formError: false,
      fileError: false,
      documentId: 0,
      documents: [],
      creatingDocument: false,
      signedDoc: []
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
    const {
      documents,
      issuerName,
      documentStore,
      orgUrl,
      templateUrl
    } = this.state;
    if (
      !issuerName ||
      !documentStore ||
      !orgUrl ||
      !templateUrl ||
      documents.length === 0
    ) {
      this.setState({ formError: true });
      return;
    }
    const baseDoc = createBaseDocument();
    const metaObj = {
      name: issuerName,
      documentStore,
      identityProof: { type: "DNS-TXT", location: orgUrl }
    };
    baseDoc.issuers.push(metaObj);
    baseDoc.$template.url = templateUrl;

    const groupDocuments = groupBy(documents, "id");
    const signedDoc = Object.keys(groupDocuments).map(docId => {
      const jsonData = this.batchPdf(baseDoc, groupDocuments[docId]);
      return this.issueDocument(jsonData);
    });
    this.setState({ signedDoc });
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

  issueDocument = rawJson => {
    try {
      return issueDocument(rawJson, "1.0");
    } catch (e) {
      throw new Error("Invalid Document");
    }
  };

  onInputFieldChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getErrorMessage = (formError, fieldError) =>
    formError && fieldError ? "This field is required" : "";

  render() {
    const {
      creatingDocument,
      issuerName,
      documentStore,
      templateUrl,
      orgUrl,
      documents,
      signedDoc,
      formError
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
            message={this.getErrorMessage(formError, !issuerName)}
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
            message={this.getErrorMessage(formError, !documentStore)}
            size={50}
            required
          />
        </div>
        <div className="mb2">
          Template Url
          <br />
          <Input
            className="mt2"
            name="templateUrl"
            variant="pill"
            type="text"
            placeholder="Url of the template renderer"
            onChange={this.onInputFieldChange}
            value={templateUrl}
            message={this.getErrorMessage(formError, !templateUrl)}
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
            message={this.getErrorMessage(formError, !orgUrl)}
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
        {signedDoc.length > 0 && (
          <div style={{ display: "flex" }}>
            <DocumentList signedDocuments={signedDoc} />
          </div>
        )}
        <OrangeButton
          variant="pill"
          className="mt4"
          onClick={this.onBatchClick}
          disabled={creatingDocument}
        >
          {creatingDocument ? "Creating..." : "Create Document"}
        </OrangeButton>
      </div>
    );
  }
}

export default DropzoneContainer;
