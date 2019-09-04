import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import PdfDropzoneView from "./pdfDropzoneView";
import { isValidFileExtension } from "../utils";

import { getLogger } from "../../logger";
import { invalidColor } from "../../styles/variables";
const { trace, error } = getLogger("services:dropzoneContainer");

/** @jsx jsx */
import { Global, css, jsx } from "@emotion/core";

const dropzoneStyle = (
  <Global
    styles={css`
      .viewer-container {
        text-align: center !important;
        height: 150px;
        justify-content: center !important;
        flex-direction: column !important;
        display: flex !important;
        outline: none;
        &.default {
          background-color: #E8F8FD;
          padding: 10px;
        }
      }

      .img-container {
        margin-bottom: 1rem;
        display: flex;
        height: 100%;
        img {
          height: 50px;
          float: left;
          margin: 5px;
        }
      }
      .btn {
        background-color: #fff;
        margin: 0 auto;
      }
      .pdf-container {
        width: 100px;
        word-break: break-all;
        display: flex;
        flex-direction: column;
      }
      .dropzone-title {
        text-align: left;
        height: 50px;
        border-bottom: 2px solid #BEEAF9;
        background-color: #E8F8FD;
        padding: 10px;
        span {
          color: #30C8F9;
          font-size: 20px;
        }
        svg {
          color: #30C8F9;
          font-size: 16px;
        }
      }
      .minimize {
        float: right;
      }
      .btn {
        border: 1px solid #0099cc;
        color: #fff;
        background-color: #0099cc;
        padding: 7px 23px;
        font-weight: 500;
        text-align: center;
        vertical-align: middle;
        min-width: 135px;
        cursor: pointer;
        margin: 0 auto;
      }
      .add-file {
        margin: 0;
        position: relative;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
      }
    `}
  />
);

const onDocumentDrop = (acceptedFiles, docId, handleDocumentChange) => {
  // eslint-disable-next-line no-undef
  const reader = new FileReader();
  if (reader.error) {
    error(reader.error);
  }
  reader.onload = () => {
    try {
      const base64String = reader.result.split(",")[1];
      const fileName = acceptedFiles[0].name;
      if (!isValidFileExtension(fileName)) throw new Error("Invalid File Type");
      trace(`pdf file name: ${fileName}`);
      handleDocumentChange(base64String, fileName, docId);
    } catch (e) {
      error(e);
    }
  };
  if (acceptedFiles && acceptedFiles.length && acceptedFiles.length > 0)
    acceptedFiles.map(f => reader.readAsDataURL(f));
};

const PdfDropzone = ({documents, onDocumentFileChange, onEditTitle, updateTitle, toggleDropzoneView, activeDoc, editableDoc, error}) => (
  <>
    {dropzoneStyle}
    {documents.map((doc, idx) => (
      <div className="mb2" key={idx}>
        <div className="dropzone-title">
          {editableDoc !== doc.id && <span className="mr3 fw6">{doc.title}</span>}
          {editableDoc === doc.id && <input type="text" className="mr2 fw6" value={doc.title} onKeyDown={(e) =>{ if(e.key === 'Enter') onEditTitle(0)}} onChange={(e) => updateTitle(e.target.value, doc.id)}/>}
          {editableDoc !== doc.id && <a onClick={() => onEditTitle(doc.id)}><i className="fa fa-pencil-alt" aria-hidden="true"></i></a>}
          <div className="minimize">
    { activeDoc === doc.id && <a onClick={() => toggleDropzoneView(0)}><i className="fa fa-minus-square" aria-hidden="true"></i></a>} 
    { activeDoc !== doc.id && <a onClick={() => toggleDropzoneView(doc.id)}><i className="fa fa-plus-square"></i></a>}
          </div>
        </div>
        { activeDoc === doc.id && <Dropzone
          id="pdf-dropzone"
          key={idx}
          onDrop={acceptedFiles =>
            onDocumentDrop(acceptedFiles, doc.id, onDocumentFileChange)
          }
        >
          {({ getRootProps, getInputProps }) => (
            <>
              <PdfDropzoneView
                attachments={documents[idx]["attachments"]}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
              />
            </>
          )}
        </Dropzone>}
        <div><i className="fa fa-trash"></i></div>
        {error && <small style={{ color: invalidColor }}>record has no attachments</small>}
      </div>
    ))}
  </>
);

export default PdfDropzone;

PdfDropzone.propTypes = {
  onDocumentFileChange: PropTypes.func,
  handleFileError: PropTypes.func,
  documents: PropTypes.object,
  activeDoc: PropTypes.number,
  toggleDropzoneView: PropTypes.func,
  onEditTitle: PropTypes.func,
  updateTitle: PropTypes.func,
  error: PropTypes.bool
};
