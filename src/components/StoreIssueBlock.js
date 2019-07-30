import React, { Component } from "react";
import PropTypes from "prop-types";
import HashColor from "./UI/HashColor";
import HashColorInput from "./UI/HashColorInput";
import { OrangeButton } from "./UI/Button";
import { isValidDocumentHash } from "../components/utils";

class StoreIssueBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documentHash: "",
      documentHashIsValid: true
    };

    this.onHashChange = this.onHashChange.bind(this);
    this.onIssueClick = this.onIssueClick.bind(this);
  }

  onHashChange(event) {
    this.setState({
      documentHash: event.target.value,
      documentHashIsValid: isValidDocumentHash(event.target.value)
    });
  }

  onIssueClick() {
    const { adminAddress, storeAddress, handleDocumentIssue } = this.props;
    const { documentHash } = this.state;
    if (isValidDocumentHash(documentHash)) {
      handleDocumentIssue({
        storeAddress,
        fromAddress: adminAddress,
        documentHash
      });
    } else {
      this.setState({
        documentHashIsValid: isValidDocumentHash(documentHash)
      });
    }
  }

  render() {
    const { documentHash, documentHashIsValid } = this.state;
    const { issuingDocument, issuedTx, networkId } = this.props;
    const documentHashMessage = documentHashIsValid
      ? ""
      : "Merkle root is not valid.";

    return (
      <div>
        <div>
          Issue documents with the Merkle Root Hash
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
          onClick={this.onIssueClick}
          disabled={issuingDocument}
        >
          {issuingDocument ? "Issuing…" : "Issue"}
        </OrangeButton>

        {issuedTx && !issuingDocument ? (
          <div className="mt5">
            <p>🎉 Batch has been issued.</p>
            <div>
              Transaction ID{" "}
              <HashColor hashee={issuedTx} networkId={networkId} isTx />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default StoreIssueBlock;

StoreIssueBlock.propTypes = {
  issuingDocument: PropTypes.bool,
  issuedTx: PropTypes.string,
  storeAddress: PropTypes.string,
  adminAddress: PropTypes.string,
  handleDocumentIssue: PropTypes.func,
  networkId: PropTypes.number
};
