import React from "react";
import PropTypes from "prop-types";
/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import { white } from "../../../styles/variables";

const divBase = css`
  border-radius: 5px;
  padding: 0.2em 0.5em;
`;

const selectorBase = css`
  background: ${white};
  border: none;
  :focus {
    outline: 0;
  }
`;

const Dropdown = ({options, value, handleChange}) => (<div className="ba b--light-blue" css={css(divBase)}>
    <select
        css={css(selectorBase)}
        className="pa2 provider-selector w-100"
        value={value}
        onChange={handleChange}
    >
        {options.map(o => <option value={o.value}>{o.label}</option>)}
    </select>
</div>);

export default Dropdown;

Dropdown.propTypes = {
    options: PropTypes.array,
    value: PropTypes.string,
    handleChange: PropTypes.func
  };