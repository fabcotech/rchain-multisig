import React, { Fragment, useState } from 'react';

export const OperationsComponent = (props) => {
  return (
    <div className="operations">
      {
        props.operations.length === 0 ?
        <b>No pending operations</b> : undefined
      }
      {
        props.operations.map((o, i) => {
          let c = 'is-info';
          if (o.type === 'KICKOUT') {
            c = 'is-warning'
          }

          return (<div>
            { !!props.proposeOperations && <button onClick={
              () => {
                props.removeOperation(i)
              }
            } className="button remove-operation is-small">cancel</button> }
            <span className={`tag ${c}`}>{o.type}</span>
            <pre>
              {
                Object.keys(o).filter(k => k !== "type").map(k => {
                  return `${k} : ${o[k]}\n`
                })
              }
            </pre>
          </div>)
        })
      }
      {
        props.operations.length && !!props.proposeOperations ?
        <button type="button" className="button is-normal" onClick={() => props.proposeOperations(undefined)}>
          Propose
          { props.operations.length === 1 ? ' 1 operation' : ` ${props.operations.length} operations`}
        </button> : undefined
      }
      {
        !!props.proposeOperations && props.proposedOperations.length ?
        <>
          <br />
          <br />
          <button type="button" className="button is-normal" onClick={() => props.proposeOperations('null')}>
            Cancel current proposal ({props.proposedOperations.length} operation(s))
          </button> 
        </> : undefined
      }
    </div>
  )
}
