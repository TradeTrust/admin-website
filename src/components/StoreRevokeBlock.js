import React, { Component } from "react";
import PropTypes from "prop-types";
import HashColor from "./UI/HashColor";
import HashColorInput from "./UI/HashColorInput";
import { OrangeButton } from "./UI/Button";
import Modal from "./UI/Modal";

class StoreRevokeBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      certificateHash: ""
    };

    this.onHashChange = this.onHashChange.bind(this);
    this.onRevokeClick = this.onRevokeClick.bind(this);
  }

  onHashChange(event) {
    this.setState({
      certificateHash: event.target.value
    });
  }

  onRevokeClick() {
    const { adminAddress, storeAddress, handleCertificateRevoke } = this.props;

    const yes = window.confirm("Are you sure you want to revoke this hash?"); // eslint-disable-line

    if (yes) {
      handleCertificateRevoke({
        storeAddress,
        fromAddress: adminAddress,
        certificateHash: this.state.certificateHash
      });
    }
  }

  render() {
    const { revokedTx, networkId } = this.props;
    return (
      <div>
        <div>
          Certificate hash to revoke
          <HashColorInput
            className="mt2"
            variant="pill"
            type="hash"
            hashee={this.state.certificateHash}
            onChange={this.onHashChange}
            value={this.state.certificateHash}
            placeholder="0x…"
          />
        </div>
        <OrangeButton
          variant="pill"
          className="mt4"
          onClick={this.onRevokeClick}
        >
          <i className="fas fa-exclamation-triangle" />
          &nbsp;
          {this.props.revokingCertificate ? "Revoking…" : "Revoke"}
        </OrangeButton>

        <Modal
          buttonText="Select Certificate"
          titleText="Please select a certificate or drag and drop it below."
        >
          Hello world
        </Modal>

        {revokedTx ? (
          <div className="mt5">
            <p>Revoked certificate batch.</p>
            <div>
              Transaction ID
              <HashColor hashee={revokedTx} networkId={networkId} isTx />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default StoreRevokeBlock;

StoreRevokeBlock.propTypes = {
  revokingCertificate: PropTypes.bool,
  revokedTx: PropTypes.string,
  storeAddress: PropTypes.string,
  adminAddress: PropTypes.string,
  handleCertificateRevoke: PropTypes.func,
  networkId: PropTypes.number
};
