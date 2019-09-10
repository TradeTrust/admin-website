const DocumentList = props =>
  props.signedDocuments.map((doc, idx) => (
    <div key={idx} style={{ width: 70, margin: 5 }}>
      <a
        href={`data:text/plain;,${JSON.stringify(doc, null, 2)}`}
        download={`Doc-${idx + 1}.tt`}
      >
        <img
          style={{ cursor: "grabbing" }}
          src="/static/images/dropzone/cert.png"
          width="100%"
        />
      </a>
      <span className="mb2">{`${
        doc.data.documentUrl.split(":")[2].split("/")[2]
      }`}</span>
    </div>
  ));

export default DocumentList;
