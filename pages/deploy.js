// polyfill is required to fix regeneratorRuntime issue for ledgerhq u2f
// see: https://github.com/LedgerHQ/ledgerjs/issues/218
import React from "react";
import "@babel/polyfill";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getIsLoading } from "../src/reducers/application";
import AdminContainer from "../src/components/admin";
import PageLoader from "../src/components/UI/PageLoader";
import { brandOrange } from "../src/styles/variables";

const AdminPage = props => (
  <React.Fragment>
    {props.isLoading && <PageLoader loaderColor={brandOrange} />}
    <div className="min-vh-100">
      <div className="mw9 mw8-ns center pa4 br3">
        <AdminContainer {...props} />
      </div>
    </div>
  </React.Fragment>
);

const mapStateToProps = store => ({
  isLoading: getIsLoading(store)
});

const mapDispatchToProps = dispatch => ({
  getIsLoading: payload => dispatch(getIsLoading(payload))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPage);

AdminPage.propTypes = {
  isLoading: PropTypes.bool
};
