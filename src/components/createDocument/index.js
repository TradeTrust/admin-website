import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import DropzoneContainer from "./dropzoneContainer";
import {
  loadAdminAddress,
  getAdminAddress,
  issueDocument,
  getIssuingDocument
} from "../../reducers/admin";
import { updateNetworkId, getNetworkId } from "../../reducers/application";

class CreateDocumentView extends Component {
  componentDidMount() {
    if (!this.props.networkId) {
      this.props.updateNetworkId();
      this.props.loadAdminAddress();
    }
  }

  handleDocumentIssue = payload => this.props.issueDocument(payload);

  render() {
    const { adminAddress } = this.props;
    return (
      <DropzoneContainer
        adminAddress={adminAddress}
        handleDocumentIssue={this.handleDocumentIssue}
      />
    );
  }
}

const mapStateToProps = store => ({
  adminAddress: getAdminAddress(store),
  networkId: getNetworkId(store),
  issuingDocument: getIssuingDocument(store)
});

const mapDispatchToProps = dispatch => ({
  loadAdminAddress: payload => dispatch(loadAdminAddress(payload)),
  updateNetworkId: () => dispatch(updateNetworkId()),
  issueDocument: payload => dispatch(issueDocument(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateDocumentView);

CreateDocumentView.propTypes = {
  adminAddress: PropTypes.string,
  storeAddress: PropTypes.string,
  networkId: PropTypes.number,
  updateNetworkId: PropTypes.func,
  loadAdminAddress: PropTypes.func,
  issueDocument: PropTypes.func
};
