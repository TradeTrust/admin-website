import PropTypes from "prop-types";

import Dropzone from "react-dropzone";
import PdfDropzoneView from "./pdfDropzoneView";

const onDocumentDrop = (
  acceptedFiles,
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
      const fileName = acceptedFiles[0].name;
      handleDocumentChange(fileName);
    } catch (e) {
      console.log(e);
    }
  };
  if (acceptedFiles && acceptedFiles.length && acceptedFiles.length > 0)
    acceptedFiles.map(f => reader.readAsText(f));
};

const PdfDropzone = props => (
  <Dropzone
    id="pdf-dropzone"
    onDrop={acceptedFiles =>
      onDocumentDrop(
        acceptedFiles,
        props.handleDocumentChange,
        props.handleFileError
      )
    }
  >
    {({ getRootProps, getInputProps }) => (
      <>
        <PdfDropzoneView
          accept={true}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
        <PdfDropzoneView
          accept={true}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
        <PdfDropzoneView
          accept={true}
          getRootProps={getRootProps}
          getInputProps={getInputProps}
        />
      </>
    )}
  </Dropzone>
);

export default PdfDropzone;

PdfDropzone.propTypes = {
  handleDocumentChange: PropTypes.func,
  handleFileError: PropTypes.func
};
