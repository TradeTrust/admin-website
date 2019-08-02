import Dropzone from "react-dropzone";
import DefaultView from "./defaultView";

const onDocumentDrop = (acceptedFiles, handleDocumentChange) => {
// eslint-disable-next-line no-undef
const reader = new FileReader();
if (reader.error) {
  handleFileError(reader.error);
}
reader.onload = (evt) => {
  try {
    const fileName = acceptedFiles[0].name;
    handleDocumentChange(evt.target.result, fileName);
  } catch (e) {
    console.log(e)
  }
};
if (acceptedFiles && acceptedFiles.length && acceptedFiles.length > 0)
  acceptedFiles.map(f => reader.readAsDataURL(f)); 
}

const BatchDocument = (props) => {
    return (
        <Dropzone
        id="pdf-dropzone"
        onDrop={acceptedFiles =>
            onDocumentDrop(acceptedFiles, props.handleDocumentChange)
        }
        className="h-100"
      >
      {({getRootProps, getInputProps}) => (
        <DefaultView getRootProps={getRootProps} getInputProps={getInputProps} />
      )}
      </Dropzone>
    );
}

export default BatchDocument;