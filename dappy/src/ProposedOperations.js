import React, { Fragment, useState } from 'react';

import { OperationsComponent } from './Operations';
import { hashCode } from './App';

export const ProposedOperationsComponent = (props) => {
  const [check, setCheck] = useState(undefined);

  let groups = {}
  Object.keys(props.proposedOperations).forEach(memberId => {
    const hash = hashCode(JSON.stringify(props.proposedOperations[memberId]))
    if (groups[hash]) {
      groups[hash].members.push(memberId)
    } else {
      groups = {
        ...groups,
        [hash]: {
          operations: props.proposedOperations[memberId],
          members: [memberId]
        }
      }
    }
  });

  if (check) {
    return <div>
      <button className="button is-small" onClick={() => setCheck(undefined)}>back</button>
      <br />
      <br />
      <b>Operations proposed by {groups[check].members.join(', ')}</b>
      <br />
      <br />
      <OperationsComponent operations={groups[check].operations}></OperationsComponent>
      <button onClick={
        () => { 
          props.addOperations(groups[check].operations, true)
        }
      } type="button" className="button is-normal">copy operations</button>
    </div>
  }

  return (
    <div className="proposed-operations">
      {
        Object.keys(groups).length === 0 &&
        <b>No pending operations</b>
      }
      {
        Object.keys(groups).map((o, i) => {
          return (<div className="proposed-operation">
            <h5 className="title is-5">Group {o.toString().slice(-4)}</h5>
            <p className="pmembers">members : {groups[o].members.join(', ')}</p>
            <p className="percent">{Math.round(10000 * groups[o].members.length / props.members.length) / 100}%</p>
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