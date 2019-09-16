import PropTypes from "prop-types";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { white } from "../../../styles/variables";

const divBase = css`
  border-radius: 5px;
  padding: 0.3rem 0.5rem;
`;

const selectorBase = css`
  background: ${white};
  border: none;
  :focus {
    outline: 0;
  }
`;

const Dropdown = ({ options, value, handleChange }) => (
  <div className="ba b--light-blue mt2" css={css(divBase)}>
    <select
      css={css(selectorBase)}
      className="provider-selector w-100"
      value={value}
      onChange={handleChange}
    >
      {options.map((o, idx) => (
        <option key={idx} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default Dropdown;

Dropdown.propTypes = {
  options: PropTypes.array,
  value: PropTypes.string,
  handleChange: PropTypes.func
};
