import React, { Component } from "react";
import PropTypes from "prop-types";
import HashColor from "./UI/HashColor";
import HashColorInput from "./UI/HashColorInput";
import { OrangeButton } from "./UI/Button";
import { isValidDocumentHash } from "../components/utils";

class StoreRevokeBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documentHash: "",
      documentHashIsValid: true
    };

    this.onHashChange = this.onHashChange.bind(this);
    this.onRevokeClick = this.onRevokeClick.bind(this);
  }

  onHashChange(event) {
    this.setState({
      documentHash: event.target.value,
      documentHashIsValid: isValidDocumentHash(event.target.value)
    });
  }

  onRevokeClick() {
    const { adminAddress, storeAddress, handleDocumentRevoke } = this.props;
    const { documentHash } = this.state;

    this.setState({
      documentHashIsValid: isValidDocumentHash(documentHash)
    });
    if (isValidDocumentHash(documentHash)) {
      // eslint-disable-next-line no-alert
      const yes = window.confirm("Are you sure you want to revoke this hash?");
      if (yes) {
        handleDocumentRevoke({
          storeAddress,
          fromAddress: adminAddress,
          documentHash
        });
      }
    }
  }

  render() {
    const { documentHash, documentHashIsValid } = this.state;
    const { revokedTx, networkId } = this.props;
    const documentHashMessage = documentHashIsValid
      ? ""
      : "Merkle root/target hash is not valid.";

    return (
      <div>
        <div>
          Document hash to revoke
          <HashColorInput
            className="mt2"
            variant="pill"
            type="hash"
            hashee={documentHash}
            onChange={this.onHashChange}
            value={documentHash}
            message={documentHashMessage}
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
          {this.props.revokingDocument ? "Revoking…" : "Revoke"}
        </OrangeButton>

        {revokedTx ? (
          <div className="mt5">
            <p>Revoked document batch.</p>
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
  revokingDocument: PropTypes.bool,
  revokedTx: PropTypes.string,
  storeAddress: PropTypes.string,
  adminAddress: PropTypes.string,
  handleDocumentRevoke: PropTypes.func,
  networkId: PropTypes.number
};
