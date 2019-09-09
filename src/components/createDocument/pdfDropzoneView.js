import PropTypes from "prop-types";

const renderPdf = (pdf, idx, deletePdf) => (
  <div key={idx} className="pdf-container tc mr2">
    <div
      className="delete-icon bg-light-red"
      onClick={e => {
        e.stopPropagation();
        deletePdf(pdf.filename);
      }}
    >
      <i className="fa fa-trash white" style={{ fontSize: 14 }} />
    </div>
    <div className="pdf-img w-100">
      <img
        alt=".tradetrust Dropzone"
        src="/static/images/dropzone/pdf_file.svg"
      />
      <span style={{ fontSize: 12 }}>{pdf.filename}</span>
    </div>
  </div>
);

const PdfDropzoneView = ({
  getRootProps,
  getInputProps,
  attachments,
  deletePdf
}) => (
  <>
    <div
      className={`viewer-container default`}
      style={{ width: "93%" }}
      {...getRootProps()}
    >
      <div className="text-muted row tr">
        <div className="img-container fl w-70">
          {attachments.map((pdf, idx) => renderPdf(pdf, idx, deletePdf))}
        </div>
        <div className="fr w-30 add-file">
          <button type="button" className="btn">
            Add files
          </button>
          <br />
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
  getInputProps: PropTypes.func,
  deletePdf: PropTypes.func,
  attachments: PropTypes.array
};
