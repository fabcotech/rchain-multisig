import React, { Fragment, useState } from 'react';

const useInput = ({ type, className /*...*/ }) => {
  const [value, setValue] = useState("");
  const input = <input value={value} onChange={e => setValue(e.target.value)} type={type} className={className} />;
  return [value, input];
}

export const LoadComponent = (props) => {
  const [uri, uriInput] = useInput({ type: "text", className: "input" });
  const [as, asInput] = useInput({ type: "text", className: "input" });
  const [as2, as2Input] = useInput({ type: "text", className: "input" });

  return <>
    <div className="form">
      <h4 className="title is-4">Load multisig</h4>
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
        <button disabled={props.loading} className="button is-normal" onClick={() => props.load({
          uri: uri,
          as: as,
        })}>{props.loading ? 'Loading multisig' : 'Load multisig'}</button> :
        <button className="button is-normal disabled" disabled={true}>Load multisig</button>
    }
    {
      props.loadError &&
      <p className="text-danger">{props.loadError}</p>
    }
    <br />
    <br />
    <h4 className="title is-4">Deploy new multisig</h4>
    <div class="field is-horizontal">
      <label class="label fc ">Member ID</label>
      <div class="control">
        {as2Input}
      </div>
    </div>
    { 
      as2 && as2.length ?
        <button disabled={props.deploying} className="button is-normal" onClick={() => props.deploy({
          as: as2,
        })}>{props.loading ? 'Deploying new multisig' : 'Deploy new multisig'}</button> :
        <button className="button is-normal disabled" disabled={true}>Deploy new  multisig</button>
    }
    {
      props.loadError &&
      <p className="text-danger">{props.deployError}</p>
    }
  </>;
}