import PropTypes from "prop-types";
import certificateIndex from "../certificateTemplates";

const getCertificateTemplates = () => [
  {
    id: "certificate",
    template: certificateIndex["default-cert"],
    label: "Certificate"
  },
  {
    id: "template",
    template: certificateIndex.default,
    label: "Transcript"
  }
];

const renderCertificate = (certificate, template) => (
  // dangerouslySetInnerHTML is okay because Handlebar mitigates script injection
  <div dangerouslySetInnerHTML={{ __html: template(certificate) }} />
);

const renderTabList = (templates = []) => {
  const tabs = templates.map((t, i) => (
    <li className={`nav-item${i === 0 ? " ml-auto" : ""}`} key={i}>
      <a
        className={`nav-link${i === 0 ? " active" : ""}`}
        data-toggle="tab"
        aria-controls={`${t.id}`}
        href={`#${t.id}`}
        role="tab"
        id={`${t.id}-tab`}
      >
        {t.label}
      </a>
    </li>
  ));
  return (
    <ul className="nav nav-tabs bg-light" role="tablist">
      {tabs}
    </ul>
  );
};

const renderTabContent = (certificate, templates = []) => {
  const contents = templates.map((t, i) => (
    <div
      id={`${t.id}`}
      key={i}
      className={`tab-pane fade${i === 0 ? " show active" : ""}`}
      role="tabpanel"
      aria-labelledby={`${t.id}-tab`}
    >
      {renderCertificate(certificate, t.template)}
    </div>
  ));
  return (
    <div className="tab-content bg-white p-3 mt-3 rounded" id="myTabContent">
      {contents}
    </div>
  );
};

const MultiCertificateRenderer = ({ certificate }) => {
  const templates = getCertificateTemplates(certificate);
  const renderedTabs = renderTabList(templates);
  const renderedContent = renderTabContent(certificate, templates);

  return (
    <div>
      {renderedTabs}
      {renderedContent}
    </div>
  );
};

export default MultiCertificateRenderer;

MultiCertificateRenderer.propTypes = {
  certificate: PropTypes.object
};
