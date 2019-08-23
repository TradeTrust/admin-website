import PropTypes from "prop-types";
/** @jsx jsx */
import { Global, css, jsx } from "@emotion/core";

const dropzoneStyle = (
  <Global
    styles={css`
      .viewer-container {
        text-align: center !important;
        padding: 1rem;
        height: 100%;
        justify-content: center !important;
        flex-direction: column !important;
        display: flex !important;
        border-radius: 10px;

        &.default {
          background-color: #f5f8fb;
          border: 2px dashed #0099cc;
          box-shadow: 0 0 0px 10px #f5f8fb;
        }
      }

      .img-container {
        margin-bottom: 1rem;
        display: flex;
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
    `}
  />
);

const renderPdf = (document, idx) => (
  <div key={idx} className="pdf-container">
    <img
      alt=".tradetrust Dropzone"
      src="/static/images/dropzone/pdf_file.svg"
    />
    <span style={{ fontSize: 12 }}>{document.name}</span>
  </div>
);

const PdfDropzoneView = ({ getRootProps, getInputProps, documents }) => (
  <>
    {dropzoneStyle}
    <div
      className={`viewer-container mb4  default`}
      style={{ borderRadius: 10 }}
      {...getRootProps()}
    >
      <div
        className="text-brand-dark"
        style={{ fontSize: "1.375rem", fontWeight: 500 }}
      >
        Drag and drop pdf files
      </div>
      <div className="img-container">
        {documents.map((doc, idx) => renderPdf(doc, idx))}
      </div>
      <div className="text-muted row">
        <div className="mx-auto">
          <input {...getInputProps()} />
        </div>
      </div>
    </div>
  </>
);

export default PdfDropzoneView;

PdfDropzoneView.propTypes = {
  documents: PropTypes.array,
  getRootProps: PropTypes.func,
  getInputProps: PropTypes.func
};
