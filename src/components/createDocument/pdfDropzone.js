import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import PdfDropzoneView from "./pdfDropzoneView";

const onDocumentDrop = (
  acceptedFiles,
  docId,
  handleDocumentChange,
  handleFileError
) => {
  // eslint-disable-next-line no-undef
  const reader = new FileReader();
  if (reader.error) {
    handleFileError(reader.error);
  }
  reader.onload = () => {
    try {
      const base64String = reader.result;
      const fileName = acceptedFiles[0].name;
      handleDocumentChange(base64String, fileName, docId);
    } catch (e) {
      console.log(e);
    }
  };
  if (acceptedFiles && acceptedFiles.length && acceptedFiles.length > 0)
    acceptedFiles.map(f => reader.readAsDataURL(f));
};

const PdfDropzone = props => (
  <>
    {Object.keys(props.documents).map((docId, idx) => (
      <Dropzone
        id="pdf-dropzone"
        key={idx}
        onDrop={acceptedFiles =>
          onDocumentDrop(
            acceptedFiles,
            docId,
            props.onDocumentFileChange,
            props.handleFileError
          )
        }
      >
        {({ getRootProps, getInputProps }) => (
          <>
            <PdfDropzoneView
              accept={true}
              documents={props.documents[docId]}
              getRootProps={getRootProps}
              getInputProps={getInputProps}
            />
          </>
        )}
      </Dropzone>
    ))}
  </>
);

export default PdfDropzone;

PdfDropzone.propTypes = {
  onDocumentFileChange: PropTypes.func,
  handleFileError: PropTypes.func,
  documents: PropTypes.object
};
