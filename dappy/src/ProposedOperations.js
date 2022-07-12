import React, { Fragment, useState } from 'react';

import { OperationsComponent } from './Operations';

export const ProposedOperationsComponent = (props) => {
  const [check, setCheck] = useState(undefined);


  let operations = [];
  if (
    props.as &&
    props.proposedOperations &&
    Object.keys(props.proposedOperations.proposals).find(k => {
      return props.proposedOperations.proposals[k].includes(props.as)
    })
  ) {
    const hash = Object.keys(props.proposedOperations.proposals).find(k => {
      return props.proposedOperations.proposals[k].includes(props.as)
    });
    operations = props.proposedOperations.operations[hash];
  }

  console.log('operations')
  console.log(operations)
  console.log('check')
  console.log(check)
  console.log('proposedOperations')
  console.log(props.proposedOperations)

  if (check) {
    return <div>
      <button className="button is-small" onClick={() => setCheck(undefined)}>back</button>
      <br />
      <br />
      <b>Operations proposed by {props.proposedOperations.proposals[check].join(', ')}</b>
      <br />
      <br />
      <OperationsComponent operations={props.proposedOperations.operations[check]}></OperationsComponent>
      <button onClick={
        () => { 
          props.addOperations(props.proposedOperations.operations[check], true)
        }
      } type="button" className="button is-normal">copy operations</button>
    </div>
  }

  return (
    <div className="proposed-operations">
      {
        Object.keys(props.proposedOperations.proposals).length === 0 &&
        <b>No pushed proposals</b>
      }
      {
        Object.keys(props.proposedOperations.proposals).map((hash, i) => {
          return (<div key={hash} className="proposed-operation">
            <h5 className="title is-5">Proposal {hash.toString().slice(-4)}</h5>
            <p className="pmembers">Proposing members : {props.proposedOperations.proposals[hash].join(', ')}</p>
            <p className="percent">{Math.round(10000 * props.proposedOperations.proposals[hash].length / props.members.length) / 100}%</p>
            <div>
              <button onClick={
                () => { setCheck(hash) }
              } type="button" className="button is-small">check operations</button>
            </div>
          </div>)
        })
      }

    </div>
  )

}