import React, { Component } from "react";
import DocumentDropzone from "./documentDropzone";
import PdfDropzone from "./pdfDropzone";
import { OrangeButton } from "../UI/Button";
import Input from "../UI/Input";

class DropzoneContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileError: false,
      batchStep: "step1",
      file: null,
      fileName: "",
      documents: [],
      batchingDocument: false
    };
    this.handleDocumentChange = this.handleDocumentChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleFileError = this.handleFileError.bind(this);
  }

  handleFileError = () => {};

  handleFileChange(file, fileName) {
    this.setState({ fileError: false, batchStep: "step2", file, fileName });
  }

  handleDocumentChange(docName) {
    const documents = JSON.parse(JSON.stringify(this.state.documents));
    documents.push({ value: null, name: docName });
    this.setState({ documents });
  }

  onBatchClick = () => {};

  render() {
    const { batchingDocument } = this.state;
    return (
      <div>
        <div className="mb2">
          Issuer Name
          <br />
          <Input
            className="mt2"
            variant="pill"
            type="text"
            placeholder="Name of organization"
            onChange={this.onBatchClick}
            value={""}
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
            variant="pill"
            type="text"
            placeholder="Ether ethereum address"
            onChange={this.onBatchClick}
            value={""}
            message={""}
            size={50}
            required
          />
        </div>
        <div className="mb4">
          Organization Url
          <br />
          <Input
            className="mt2"
            variant="pill"
            type="text"
            placeholder="Url of the organization"
            onChange={this.onBatchClick}
            value={""}
            message={""}
            size={50}
            required
          />
        </div>
        <div className="mb4">
          <DocumentDropzone handleFileChange={this.handleFileChange} />
        </div>
        <div className="mb4">
          <PdfDropzone />
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
