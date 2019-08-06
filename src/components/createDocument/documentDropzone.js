import PropTypes from "prop-types";
import Dropzone from "react-dropzone";
import DefaultView from "./defaultView";

const onFileDrop = (acceptedFiles, handleFileChange, handleFileError) => {
  // eslint-disable-next-line no-undef
  const reader = new FileReader();
  if (reader.error) {
    handleFileError(reader.error);
  }
  reader.onload = () => {
    try {
      const json = JSON.parse(reader.result);
      const fileName = acceptedFiles[0].name;
      handleFileChange(json, fileName);
    } catch (e) {
      console.log(e);
    }
  };
  if (acceptedFiles && acceptedFiles.length && acceptedFiles.length > 0)
    acceptedFiles.map(f => reader.readAsText(f));
};

const DocumentDropzone = props => (
  <Dropzone
    id="certificate-dropzone"
    onDrop={acceptedFiles =>
      onFileDrop(acceptedFiles, props.handleFileChange, props.handleFileError)
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
  handleFileChange: PropTypes.func,
  handleFileError: PropTypes.func
};
