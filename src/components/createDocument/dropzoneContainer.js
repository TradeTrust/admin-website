import React, { Component } from "react";
import PropTypes from "prop-types";
import DocumentDropzone from "./documentDropzone";
import BatchDocument from "./batchDocument";
const {
    issueDocument,
    issueDocuments
} = require("@govtechsg/tradetrust-schema");
import { OrangeButton } from "../UI/Button";

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
        }
    }

    handleFileError = () => {

    }

    handleFileChange = (file, fileName) => {
        this.setState({ fileError: false, batchStep: "step2", file, fileName });
    }

    handleDocumentChange = (data, docName) => {
        let documents = JSON.parse(JSON.stringify(this.state.documents));
        documents.push({ value: data, name: docName });
        console.log(data, docName)
        this.setState({ documents });
    }

    onBatchClick = () => {
        const {documents, file} = this.state;
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
          console.log(signedDocument)
          } catch(e) {
              console.log(e);
          }

          this.setState({file: updatedFile});
    }

    render() {
        const { batchStep, fileName, documents, batchingDocument } = this.state;
        console.log(this.state.file);
        return (
            <>
                {batchStep === "step1" ? <DocumentDropzone handleFileChange={this.handleFileChange} /> : <BatchDocument handleDocumentChange={this.handleDocumentChange} />}
                {batchStep === "step2" && <p> <b>Raw json file:</b>  {fileName} </p>}
                {batchStep === "step2" && <p> <b>Document files to be attached:</b>  {documents.map(doc => <span>{doc.name}</span>)} </p>}
                <OrangeButton
                    variant="pill"
                    className="mt4"
                    onClick={this.onBatchClick}
                    disabled={batchingDocument}
                >
                    {batchingDocument ? "Batching…" : "Batch Document"}
                </OrangeButton>
            </>
        )
    }
}

export default DropzoneContainer;