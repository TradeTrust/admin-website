import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PropTypes from "prop-types";

import StoreDeployBlock from "../StoreDeployBlock";
import StoreIssueBlock from "../StoreIssueBlock";
import StoreRevokeBlock from "../StoreRevokeBlock";

const AdminBlocks = ({
  handleStoreDeploy,
  handleDocumentIssue,
  handleDocumentRevoke,
  adminAddress,
  storeAddress,
  issuingDocument,
  issuedTx,
  revokingDocument,
  revokedTx,
  networkId,
  deploying,
  deployedTx
}) => (
  <Tabs className="flex flex-row w-100">
    <TabList className="flex flex-column w-30 list pa0">
      <Tab className="tab pl3">
        <h3>Deploy new instance</h3>
      </Tab>
      <Tab className="tab pl3">
        <h3>Issue document batch</h3>
      </Tab>
      <Tab className="tab pl3">
        <h3>Revoke document</h3>
      </Tab>
    </TabList>
    <div className="w-70 pa4 pl5">
      <TabPanel>
        <StoreDeployBlock
          adminAddress={adminAddress}
          storeAddress={storeAddress}
          handleStoreDeploy={handleStoreDeploy}
          deploying={deploying}
          networkId={networkId}
          deployedTx={deployedTx}
        />
      </TabPanel>
      <TabPanel>
        {storeAddress ? (
          <StoreIssueBlock
            networkId={networkId}
            issuedTx={issuedTx}
            adminAddress={adminAddress}
            storeAddress={storeAddress}
            handleDocumentIssue={handleDocumentIssue}
            issuingDocument={issuingDocument}
          />
        ) : (
          <div className="red">Enter a store address first.</div>
        )}
      </TabPanel>
      <TabPanel>
        {storeAddress ? (
          <StoreRevokeBlock
            networkId={networkId}
            revokingDocument={revokingDocument}
            revokedTx={revokedTx}
            adminAddress={adminAddress}
            storeAddress={storeAddress}
            handleDocumentRevoke={handleDocumentRevoke}
          />
        ) : (
          <div className="red">Enter a store address first.</div>
        )}
      </TabPanel>
    </div>
  </Tabs>
);

export default AdminBlocks;

AdminBlocks.propTypes = {
  deploying: PropTypes.bool,
  deployedTx: PropTypes.string,
  adminAddress: PropTypes.string,
  storeAddress: PropTypes.string,
  issuingDocument: PropTypes.bool,
  issuedTx: PropTypes.string,
  revokingDocument: PropTypes.bool,
  revokedTx: PropTypes.string,
  networkId: PropTypes.number,
  handleStoreDeploy: PropTypes.func,
  handleDocumentIssue: PropTypes.func,
  handleDocumentRevoke: PropTypes.func
};
