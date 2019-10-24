import { getData } from "@govtechsg/open-attestation";
import { get } from "lodash";
import PropTypes from "prop-types";
import { BlueButton } from "../UI/Button";

const getTitle = data => {
  const docData = getData(data);
  const title = `${get(docData, "name")}.tt`;
  return title;
};

const DocumentList = props => (
  <>
    <span className="mb4 ml4 gray fw6 f5">
      {" "}
      Click on the document to download it
    </span>
    <span className="mb4 mr1 ml4 gray fw6 f4"> OR</span>
    <BlueButton
      variant="rounded"
      className="ml4 pa1"
      onClick={props.downloadDocuments}
    >
      {"Download All"}
    </BlueButton>
    <div style={{ display: "flex" }} className="mr5 ml5">
      {props.signedDocuments.map((doc, index) => (
        <div key={index} style={{ width: 70, margin: 5 }}>
          <a
            href={`data:text/plain;charset=utf-8,${encodeURIComponent(
              JSON.stringify(doc, null, 2)
            )}`}
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
      ))}
    </div>
  </>
);

export default DocumentList;

DocumentList.propTypes = {
  signedDocuments: PropTypes.array,
  downloadDocuments: PropTypes.func
};
