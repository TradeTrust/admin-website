import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
/** @jsx jsx */
import { Global, css, jsx } from "@emotion/core";

import PdfDropzoneView from "./pdfDropzoneView";
import { isValidFileExtension } from "../utils";
import { getLogger } from "../../logger";
import { invalidColor } from "../../styles/variables";

const { trace, error } = getLogger("services:dropzoneContainer");

const dropzoneStyle = (
  <Global
    styles={css`
      .viewer-container {
        text-align: center !important;
        height: 175px;
        justify-content: center !important;
        flex-direction: column !important;
        display: flex !important;
        outline: none;
        &.default {
          background-color: #e8f8fd;
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
        padding: 5px;
        background: #fff;
        width: 150px;
        word-break: break-all;
      }
      .pdf-img {
        display: flex;
        flex-direction: column;
      }
      .delete-icon {
        border-radius: 50%;
        float: right;
        width: 25px;
        height: 25px;
      }
      .dropzone-title {
        text-align: left;
        height: 50px;
        border-bottom: 2px solid #beeaf9;
        background-color: #e8f8fd;
        padding: 10px;
        span,
        svg {
          color: #30c8f9;
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
      .delete-row {
        position: relative;
        left: -20px;
        float: right;
        margin-top: 5px;
        height: 35px;
        border-radius: 50%;
        padding: 5px 0 0 10px;
        width: 35px;
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

const PdfDropzone = ({
  documents,
  onDocumentFileChange,
  onEditTitle,
  updateTitle,
  toggleDropzoneView,
  deletePdf,
  deleteDoc,
  activeDoc,
  editableDoc,
  isError
}) => (
  <>
    {dropzoneStyle}
    {documents.map((doc, idx) => (
      <div className="mb2" key={idx}>
        <div
          className="delete-row bg-light-red"
          onClick={() => deleteDoc(doc.id)}
        >
          <i className="fa fa-trash white" />
        </div>
        <div className="dropzone-title" style={{ width: "93%" }}>
          {editableDoc !== doc.id && (
            <span className="mr3 fw6">{doc.title}</span>
          )}
          {editableDoc === doc.id && (
            <input
              type="text"
              className="mr2 fw6"
              value={doc.title}
              onBlur={() => onEditTitle(0)}
              onChange={e => updateTitle(e.target.value, doc.id)}
            />
          )}
          {editableDoc !== doc.id && (
            <a onClick={() => onEditTitle(doc.id)}>
              <i className="fa fa-pencil-alt f5" aria-hidden="true" />
            </a>
          )}
          <span
            style={{
              padding: "0 7px 2px 7px",
              marginLeft: 10,
              color: "#fff",
              background: "#357EDD",
              borderRadius: "50%"
            }}
          >
            {doc.attachments.length}
          </span>
          <div className="minimize">
            {activeDoc === doc.id && (
              <a onClick={() => toggleDropzoneView(0)}>
                <i className="fa fa-minus-square f4" aria-hidden="true" />
              </a>
            )}
            {activeDoc !== doc.id && (
              <a onClick={() => toggleDropzoneView(doc.id)}>
                <i className="fa fa-plus-square f4" />
              </a>
            )}
          </div>
        </div>
        {activeDoc === doc.id && (
          <Dropzone
            id="pdf-dropzone"
            key={idx}
            onDrop={acceptedFiles =>
              onDocumentDrop(acceptedFiles, doc.id, onDocumentFileChange)
            }
          >
            {({ getRootProps, getInputProps }) => (
              <>
                <PdfDropzoneView
                  attachments={documents[idx].attachments}
                  deletePdf={pdfName => deletePdf(pdfName, doc.id)}
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                />
              </>
            )}
          </Dropzone>
        )}
        {isError && (
          <small style={{ color: invalidColor }}>
            record has no attachments
          </small>
        )}
      </div>
    ))}
  </>
);

export default PdfDropzone;

PdfDropzone.propTypes = {
  onDocumentFileChange: PropTypes.func,
  handleFileError: PropTypes.func,
  documents: PropTypes.array,
  activeDoc: PropTypes.number,
  toggleDropzoneView: PropTypes.func,
  onEditTitle: PropTypes.func,
  updateTitle: PropTypes.func,
  deletePdf: PropTypes.func,
  deleteDoc: PropTypes.func,
  isError: PropTypes.bool,
  editableDoc: PropTypes.number
};
