import React, { Fragment, useState } from 'react';

export const useInput = ({ defaultValue, type, className /*...*/ }) => {
  const [value, setValue] = useState(defaultValue || "");
  const input = <input defaultValue={defaultValue || ''} value={value} onChange={e => setValue(e.target.value)} type={type} className={className} />;
  return [value, input];
}

export const LoadComponent = (props) => {
  const [uri, uriInput] = useInput({ defaultValue: '', type: "text", className: "input" });
  const [as2, as2Input] = useInput({ defaultValue: '', type: "text", className: "input" });

  return <>
    <div className="form">
      <h4 className="title is-4">Load multisig</h4>
      <div class="field">
      <label class="label">Multisig address</label>
        <div class="control">
          {uriInput}
        </div>
      </div>
    </div>
    <br />
    { 
      uri && uri.length ?
        <button disabled={props.loading} className="button is-normal" onClick={() => props.load({
          uri: uri,
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
    <div class="field">
      <label class="label">Choose a username for the new multisig contract !</label>
      <div class="control">
        {as2Input}
        <p class="help">Use only 0-9a-z characters for member ID</p>
      </div>
    </div>
    { 
      as2 && as2.length ?
        <button disabled={props.deploying} className="button is-normal" onClick={() => props.deploy({
          as: as2,
        })}>{props.deploying ? 'Deploying new multisig' : 'Deploy new multisig'}</button> :
        <button className="button is-normal disabled" disabled={true}>Deploy new  multisig</button>
    }
    {
      props.loadError &&
      <p className="text-danger">{props.deployError}</p>
    }
    {
      props.deploying &&
      <p >A multisig is being deployed on the blockchain, please wait</p>
    }
    <br />
    <br />
    {
      props.deployedMultisigs.length ?
        <h5 className="title is-5">Deployments :</h5>
        : undefined
    }
    {
      props.deployedMultisigs.map(dm => {
        return (
        <div>
          <b>Address :</b>
          <span>{dm}</span>
          {' '}
          <a onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(dm)
          }}>copy</a>
        </div>);
      })
    }
  </>;
}