import PropTypes from "prop-types";
/** @jsx jsx */
import { Global, css, jsx } from "@emotion/core";
import {
  faintBlue,
  brandBlue,
  faintGreen,
  warningBackground,
  warningColor,
  white,
  invalidBackground,
  invalidColor,
  black
} from "../../styles/variables";

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
          background-color: ${faintBlue};
          border: 2px dashed ${brandBlue};
          box-shadow: 0 0 0px 10px ${faintBlue};
        }

        &.accept {
          background-color: ${faintGreen};
          border: 2px dashed ${brandBlue};
          box-shadow: 0 0 0px 10px ${faintGreen};
        }

        &.warning {
          background-color: ${warningBackground};
          border: 2px dashed ${warningColor};
          box-shadow: 0 0 0px 10px ${warningBackground};
          color: ${warningColor};

          .unverified-btn {
            @include btn(
              ${warningColor},
              lighten(${warningColor}, 5%),
              ${white}
            );
          }
        }

        &.invalid {
          background-color: ${invalidBackground};
          border: 2px dashed ${invalidColor};
          box-shadow: 0 0 0px 10px ${invalidBackground};
          color: ${invalidColor};

          .unverified-btn {
            @include btn(
              ${invalidColor},
              lighten(${invalidColor}, 5%),
              ${white}
            );
          }
        }
      }

      .unverified-btn {
        margin: auto;
      }

      .image-container {
        margin-bottom: 1rem;
        img {
          height: 70px;
        }
      }

      .message-container {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        color: ${black};

        span {
          vertical-align: middle;
        }
      }

      .verifications {
        margin-bottom: 2rem;

        .messages {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 0;
        }
      }

      .select-btn {
        border: 1px solid #0099cc;
        color: #0099cc;
        background-color: #0099cc;
        padding: 7px 23px;
        border-radius: 7px;
        font-weight: 500;
        text-align: center;
        vertical-align: middle;
        min-width: 135px;
        cursor: pointer;
        background-color: #fff;
        margin: 0 auto;
      }

      .secondary-links {
        width: 50%;
        display: flex;
        margin: 1rem auto 0 auto;

        span {
          margin: auto;
          a {
            font-size: 14px;
          }
        }
      }

      .text-link {
        color: #787878 !important;
        text-decoration: underline !important;
        &:hover {
          color: #324353 !important;
        }
      }
      .row {
        display: flex;
        flex-direction: row;
      }
      col-1 {
        flex: 1;
      }
      .col-2 {
        flex: 2;
      }
      .col-3 {
        flex: 3;
      }
      .col-4 {
        flex: 4;
      }
      .mx-auto {
        margin: auto;
      }
    `}
  />
);

const DefaultView = ({ getRootProps, getInputProps, accept }) => (
  <>
    {dropzoneStyle}
    <div
      className={`viewer-container ${
        // eslint-disable-next-line no-nested-ternary
        accept ? "default" : "invalid"
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
          File cannot be read. Please check that you have a valid .pdf file
        </div>
      )}
      <div
        className="text-brand-dark mb4"
        style={{ fontSize: "1.375rem", fontWeight: 500 }}
      >
        Drag and drop your attachments
      </div>
      <div className="text-muted row mb2">
        <div className="col-4">
          <hr />
        </div>
        <div className="col-2">or</div>
        <div className="col-4">
          <hr />
        </div>
      </div>
      <div className="text-muted row">
        <div className="mx-auto">
          <button type="button" className="select-btn">
            Select File
          </button>
          <input {...getInputProps()} />
        </div>
      </div>
    </div>
  </>
);

export default DefaultView;

DefaultView.propTypes = {
  hover: PropTypes.bool,
  accept: PropTypes.bool,
  getRootProps: PropTypes.func,
  getInputProps: PropTypes.func
};
