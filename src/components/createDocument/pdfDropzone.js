import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import PdfDropzoneView from "./pdfDropzoneView";
import { isValidFileExtension } from "../utils";

import { getLogger } from "../../logger";

const { trace, error } = getLogger("services:dropzoneContainer");

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

const PdfDropzone = props => (
  <>
    {Object.keys(props.documents).map((docId, idx) => (
      <div key={idx}>
        {idx === 0 && (
          <h3>Drag and drop more pdf files to add to the document</h3>
        )}
        <li className="mb4">{`Doc-${docId}.json`}</li>
        <Dropzone
          id="pdf-dropzone"
          key={idx}
          onDrop={acceptedFiles =>
            onDocumentDrop(acceptedFiles, docId, props.onDocumentFileChange)
          }
        >
          {({ getRootProps, getInputProps }) => (
            <>
              <PdfDropzoneView
                documents={props.documents[docId]}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
              />
            </>
          )}
        </Dropzone>
      </div>
    ))}
  </>
);

export default PdfDropzone;

PdfDropzone.propTypes = {
  onDocumentFileChange: PropTypes.func,
  handleFileError: PropTypes.func,
  documents: PropTypes.object
};
