import PropTypes from "prop-types";

const renderPdf = (document, idx) => (
  <div key={idx} className="pdf-container">
    <img
      alt=".tradetrust Dropzone"
      src="/static/images/dropzone/pdf_file.svg"
    />
    <span style={{ fontSize: 12 }}>{document.filename}</span>
  </div>
);

const PdfDropzoneView = ({ getRootProps, getInputProps, attachments }) => (
  <>
    <div
      className={`viewer-container mb4  default`}
      {...getRootProps()}
    >
    <div className="text-muted row tr">
      <div className="img-container fl w-70">
        {attachments.map((pdf, idx) => renderPdf(pdf, idx))}
      </div>
      <div className="fr w-30 add-file">
        <button type="button" className="btn">Add files</button><br/>
        <span> or drag and drop files</span>
      </div>
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
