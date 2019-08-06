import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import DefaultView from "./defaultView";

const onFileDrop = (acceptedFiles, onDocumentFileChange, handleFileError) => {
  // eslint-disable-next-line no-undef
  const reader = new FileReader();
  if (reader.error) {
    handleFileError(reader.error);
  }
  reader.onload = () => {
    try {
      const base64String = reader.result;
      const fileName = acceptedFiles[0].name;
      onDocumentFileChange(base64String, fileName);
    } catch (e) {
      console.log(e);
    }
  };
  if (acceptedFiles && acceptedFiles.length && acceptedFiles.length > 0)
    acceptedFiles.map(f => reader.readAsDataURL(f));
};

const DocumentDropzone = props => (
  <Dropzone
    id="document-dropzone"
    onDrop={acceptedFiles =>
      onFileDrop(
        acceptedFiles,
        props.onDocumentFileChange,
        props.handleFileError
      )
    }
    className="h-100"
  >
    {({ getRootProps, getInputProps }) => (
      <DefaultView
        accept={true}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
      />
    )}
  </Dropzone>
);

export default DocumentDropzone;

DocumentDropzone.propTypes = {
  onDocumentFileChange: PropTypes.func,
  handleFileError: PropTypes.func
};
