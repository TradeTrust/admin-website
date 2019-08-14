import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
/** @jsx jsx */
import { Global, css, jsx } from "@emotion/core";

import {
  lightGrey,
  faintOrange,
  brandOrange,
  brandDarkOrange
} from "../../styles/variables";
import { isValidAddress } from "../utils";
import {
  loadAdminAddress,
  getAdminAddress,
  deployStore,
  getStoreAddress,
  updateStoreAddress,
  issueDocument,
  getIssuedTx,
  getRevokedTx,
  revokeDocument,
  getrevokingDocument,
  getDeploying,
  getIssuingDocument,
  getDeployedTx
} from "../../reducers/admin";
import { updateNetworkId, getNetworkId } from "../../reducers/application";
import HashColor from "../UI/HashColor";
import HashColorInput from "../UI/HashColorInput";
import Panel from "../UI/Panel";
import NetworkSelectorContainer from "../NetworkSelectorContainer";
import ErrorPage from "../ErrorPage";
import AdminBlocks from "./adminBlocks";

const baseStyle = (
  <Global
    styles={css`
      .click-to-refresh {
        transform: rotateZ(0deg);
        transition: transform 1.5s ease-in;
      }
      .click-to-refresh:hover {
        color: ${brandDarkOrange};
      }
      .click-to-refresh:active {
        transform: rotateZ(-360deg);
        transition: transform 0s;
      }
      .click-to-refresh:focus {
        outline: none;
      }

      .tab {
        cursor: pointer;
        border: solid 1px ${lightGrey};
      }

      .tab:hover {
        background-color: ${faintOrange};
      }

      .tab[aria-selected="true"] {
        border-left: solid 4px ${brandOrange};
        color: ${brandOrange};
        border-right: 0;
      }
    `}
  />
);

class AdminContainer extends Component {
  constructor(props) {
    super(props);
    this.refreshCurrentAddress = this.refreshCurrentAddress.bind(this);
    this.handleStoreDeploy = this.handleStoreDeploy.bind(this);
    this.storeAddressOnChange = this.storeAddressOnChange.bind(this);
    this.handleDocumentIssue = this.handleDocumentIssue.bind(this);
    this.handleDocumentRevoke = this.handleDocumentRevoke.bind(this);

    this.state = {
      localStoreAddress: ""
    };
  }

  componentDidMount() {
    if (!this.props.networkId) {
      this.props.updateNetworkId();
      this.props.loadAdminAddress();
    }
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.storeAddress !== this.state.localStoreAddress) {
      this.setState({ localStoreAddress: nextProps.storeAddress });
    }
  }

  storeAddressOnChange(event) {
    const address = event.target.value;
    this.setState({ localStoreAddress: address });
    if (isValidAddress(address)) {
      this.props.updateStoreAddress(address);
    }
  }

  handleStoreDeploy(payload) {
    this.props.deployStore(payload);
  }

  handleDocumentIssue(payload) {
    this.props.issueDocument(payload);
  }

  handleDocumentRevoke(payload) {
    this.props.revokeDocument(payload);
  }

  refreshCurrentAddress() {
    this.props.loadAdminAddress();
  }

  render() {
    const { adminAddress, networkId } = this.props;

    return (
      <React.Fragment>
        {adminAddress ? (
          <Panel>
            {baseStyle}
            <div className="flex">
              <div className="w-50">
                <h1 className="mt0">Admin</h1>
              </div>
              <div className="w-50">
                <NetworkSelectorContainer />
              </div>
            </div>
            <div className="flex bb pb3">
              <div className="w-50">
                <h3>
                  Current account{" "}
                  <div
                    style={{ cursor: "pointer" }}
                    className="dib click-to-refresh"
                    onClick={this.refreshCurrentAddress}
                    title="Try to grab current account"
                    tabIndex={1}
                  >
                    <i className="fas fa-sync-alt" />
                  </div>
                </h3>
                <div className="pa2">
                  {adminAddress ? (
                    <HashColor hashee={adminAddress} networkId={networkId} />
                  ) : (
                    <div className="red">No wallet address found.</div>
                  )}
                </div>
              </div>
              <div className="w-50">
                <h3>Store address</h3>
                <HashColorInput
                  variant="rounded"
                  type="address"
                  value={this.state.localStoreAddress}
                  onChange={this.storeAddressOnChange}
                  placeholder="Enter existing (0x…), or deploy new instance"
                />
              </div>
            </div>
            <AdminBlocks
              handleStoreDeploy={this.handleStoreDeploy}
              handleDocumentIssue={this.handleDocumentIssue}
              handleDocumentRevoke={this.handleDocumentRevoke}
              {...this.props}
            />
          </Panel>
        ) : (
          <ErrorPage />
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = store => ({
  adminAddress: getAdminAddress(store),
  storeAddress: getStoreAddress(store),
  issuedTx: getIssuedTx(store),
  revokingDocument: getrevokingDocument(store),
  revokedTx: getRevokedTx(store),
  networkId: getNetworkId(store),
  deploying: getDeploying(store),
  deployedTx: getDeployedTx(store),
  issuingDocument: getIssuingDocument(store)
});

const mapDispatchToProps = dispatch => ({
  loadAdminAddress: payload => dispatch(loadAdminAddress(payload)),
  updateNetworkId: () => dispatch(updateNetworkId()),
  deployStore: payload => dispatch(deployStore(payload)),
  issueDocument: payload => dispatch(issueDocument(payload)),
  revokeDocument: payload => dispatch(revokeDocument(payload)),
  updateStoreAddress: payload => dispatch(updateStoreAddress(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminContainer);

AdminContainer.propTypes = {
  deploying: PropTypes.bool,
  deployedTx: PropTypes.string,
  updateNetworkId: PropTypes.func,
  loadAdminAddress: PropTypes.func,
  deployStore: PropTypes.func,
  issueDocument: PropTypes.func,
  updateStoreAddress: PropTypes.func,
  adminAddress: PropTypes.string,
  storeAddress: PropTypes.string,
  issuingDocument: PropTypes.bool,
  issuedTx: PropTypes.string,
  revokingDocument: PropTypes.bool,
  revokedTx: PropTypes.string,
  revokeDocument: PropTypes.func,
  networkId: PropTypes.number
};
