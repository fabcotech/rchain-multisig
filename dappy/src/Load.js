import React, { Fragment, useState } from 'react';

const useInput = ({ type, className /*...*/ }) => {
  const [value, setValue] = useState("");
  const input = <input value={value} onChange={e => setValue(e.target.value)} type={type} className={className} />;
  return [value, input];
}

export const LoadComponent = (props) => {
  const [uri, uriInput] = useInput({ type: "text", className: "input" });
  const [as, asInput] = useInput({ type: "text", className: "input" });

  return <>
    <div className="form">
      <div class="field is-horizontal">
      <label class="label fc ">address</label>
        <div class="control">
          {uriInput}
        </div>
      </div>
      <div class="field is-horizontal">
        <label class="label fc ">Identify as</label>
        <div class="control">
          {asInput}
        </div>
      </div>
    </div>
    <br />
    <br />
    { 
      uri && uri.length ?
        <button className="button is-normal" onClick={() => props.load({
          uri: uri,
          as: as,
        })}>Load multisig</button> :
        <button className="button is-normal disabled" disabled={true}>Load multisig</button>
    }
    {
      props.loadError &&
      <p className="text-danger">{props.loadError}</p>
    }
  </>;
}