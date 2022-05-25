import React, { Fragment, useState } from 'react';

import { OperationsComponent } from './Operations';

export const ProposedOperationsComponent = (props) => {
  const [check, setCheck] = useState(undefined);

  if (check) {
    return <div>
      <button className="button is-small" onClick={() => setCheck(undefined)}>back</button>
      <br />
      <br />
      <b>Operations proposed by {props.groups[check].members.join(', ')}</b>
      <br />
      <br />
      <OperationsComponent operations={props.groups[check].operations}></OperationsComponent>
      <button onClick={
        () => { 
          props.addOperations(props.groups[check].operations, true)
        }
      } type="button" className="button is-normal">copy operations</button>
    </div>
  }

  return (
    <div className="proposed-operations">
      {
        Object.keys(props.groups).length === 0 &&
        <b>No pending operations</b>
      }
      {
        Object.keys(props.groups).map((o, i) => {
          return (<div className="proposed-operation">
            <h5 className="title is-5">Proposal {o.toString().slice(-4)}</h5>
            <p className="pmembers">Proposing members : {props.groups[o].members.join(', ')}</p>
            <p className="percent">{Math.round(10000 * props.groups[o].members.length / props.members.length) / 100}%</p>
            <div>
              <button onClick={
                () => { setCheck(o) }
              } type="button" className="button is-small">check operations</button>
            </div>
          </div>)
        })
      }

    </div>
  )

}