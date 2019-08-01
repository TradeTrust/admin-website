import PropTypes from "prop-types";
/** @jsx jsx */
import { Global, css, jsx } from "@emotion/core";

const dropzoneStyle = (
    <Global
      styles={css`
      .viewer-container {
          text-align: center !important;
          padding: 1.5rem;
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
      
          &.accept {
              background-color: green;
              border: 2px dashed blue;
              box-shadow: 0 0 0px 10px green;
          }
      }
      
      .image-container {
          margin-bottom: 1rem;
          img {
              height: 110px;
          }
      }
      .btn {
          background-color: #fff;
          margin: 0 auto;
      }
      `}
    />
  );

const DefaultView = ({ getRootProps, getInputProps, hover, accept }) => (
    <>
    {dropzoneStyle}
  <div
    className={`viewer-container ${
      // eslint-disable-next-line no-nested-ternary
      hover ? (accept ? "accept" : "invalid") : "default"
    }`}
    style={{ borderRadius: 10 }}
    {...getRootProps()}
  >
    <div className="image-container">
      <i>
        <img
          alt=".tradetrust Dropzone"
          src="/static/images/dropzone/dropzone_illustration.svg"
        />
      </i>
    </div>
    {accept ? null : (
      <div>
        File cannot be read. Please check that you have a valid .tt or .json
        file
      </div>
    )}
    <div
      className="text-brand-dark"
      style={{ fontSize: "1.375rem", fontWeight: 500 }}
    >
      Drag and drop your raw json file
    </div>
    <div className="text-muted row">
      <div className="col-2" />
      <div className="col-3">
        <hr />
      </div>
      <div className="col-2">or</div>
      <div className="col-3">
        <hr />
      </div>
    </div>
    <div className="text-muted row">
      <div className="mx-auto">
        <button type="button" className={`pointer btn`}>
          Select File
        </button>
        <input  {...getInputProps()}/>
      </div>
    </div>
  </div>
  </>
);

export default DefaultView;

DefaultView.propTypes = {
  hover: PropTypes.bool,
  accept: PropTypes.bool
};
