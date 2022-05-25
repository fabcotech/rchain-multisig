import React, { Fragment, useState } from 'react';

const useInput = ({ type, className /*...*/ }) => {
  const [value, setValue] = useState("");
  const input = <input value={value} onChange={e => setValue(e.target.value)} type={type} className={className} />;
  return [value, input];
}

export const ApplyComponent = (props) => {
  const [as, asInput] = useInput({ type: "text", className: "input" });

  return <>
    <div className="form">
      <div class="field">
        <label class="label">Want to apply to the multisig ? Pick up a fun username !</label>
        <div class="control">
          {asInput}
          <p class="help">Make sure member does not exist and use only 0-9a-z characters</p>
        </div>
      </div>
    </div>
    <br />
    <br />
    { 
      as && as.length ?
        <button className="button is-normal" onClick={() => props.apply({
          as: as,
        })}>Apply</button> :
        <button className="button is-normal disabled" disabled={true}>Apply</button>
    }
    {
      props.applyError &&
      <p className="text-danger">{props.applyError}</p>
    }
  </>;
}