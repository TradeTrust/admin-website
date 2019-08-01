import React, { Component } from "react";
import PropTypes from "prop-types";
import DocumentDropzone from "./documentDropzone";
import BatchDocument from "./batchDocument";
const {
    issueDocument,
    issueDocuments
  } = require("@govtechsg/open-attestation");
import OrangeButton from "../UI/Button";

class DropzoneContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileError: false,
            batchStep:  "step1",
            file: null,
            fileName: "",
            documents: []
        }
        this.handleDocumentChange = this.handleDocumentChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleFileError = this.handleFileError.bind(this);
    }

    handleFileError = () => {

    }

    handleFileChange(file, fileName) {
        this.setState({ fileError: false, batchStep: "step2", file, fileName });
    }

    handleDocumentChange(docName) {
        let documents = JSON.parse(JSON.stringify(this.state.documents));
        documents.push({value: null, name: docName})
        this.setState({documents});
    }

    render() {
        const {batchStep, fileName, documents} = this.state;
        return (
            <>
            {batchStep === "step1" ? <DocumentDropzone handleFileChange={this.handleFileChange} /> : <BatchDocument handleDocumentChange={this.handleDocumentChange}/>}
            {batchStep === "step2" && <p> <b>Raw json file:</b>  { fileName } </p>}
            {batchStep === "step2" && <p> <b>Document files to be attached:</b>  { documents.map(doc => <span>{doc.name}</span>) } </p>}
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