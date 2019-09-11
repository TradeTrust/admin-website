import { getData } from "@govtechsg/open-attestation";
import { get } from "lodash";

const getTitle = data => {
  const docData = getData(data);
  const title = `${get(docData, "name")}.tt`;
  return title;
};

const DocumentList = props =>
  props.signedDocuments.map((doc, idx) => (
    <div key={idx} style={{ width: 70, margin: 5 }}>
      <a
        href={`data:text/plain;,${JSON.stringify(doc, null, 2)}`}
        download={getTitle(doc)}
      >
        <img
          style={{ cursor: "grabbing" }}
          src="/static/images/dropzone/cert.png"
          width="100%"
        />
      </a>
      <span className="mb2">{`${getTitle(doc)}`}</span>
    </div>
  ));

export default DocumentList;
