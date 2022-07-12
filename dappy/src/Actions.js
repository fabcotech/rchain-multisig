import React, { Fragment, useState } from 'react';

import { useInput } from './Load';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const ActionsComponent = (props) => {
  const [action, setAction] = useState(undefined);
  const [address, addressInput] = useInput({ defaultValue: '', type: "text", className: "input" });
  const [amount, amountInput] = useInput({ defaultValue: 10, type: "number", className: "input" });

  const amountInt = parseInt(amount, 10);

  return (
    <div className="actions">
      <h3 className="title is-4">Propose operations</h3>
      <div>
        {
          ['KICKOUT', 'TRANSFER_REV'].map(a => {
            let c = 'is-info';
            if (a === 'KICKOUT') {
              c = 'is-warning'
            }
            return <>
              <span key={a} onClick={() => {
                if (action === a) {
                  setAction(undefined)
                } else {
                  setAction(a)
                }
              }} className={`tag cliquable ${c}`}>{a}</span>
              {' '}
            </>
          })
        }
      </div>
      {
        action === 'TRANSFER_REV' &&
        <>
          <br />
          <div class="field">
            <label class="label">To REV address</label>
            <div class="control">
              {addressInput}
            </div>
          </div>
          <div class="field">
            <label class="label">
              Amount (dust), REV&nbsp;:&nbsp;
              {
                typeof amountInt === 'number' && !isNaN(amountInt) ?
                formatter.format(amountInt / 100000000).substr(1)
                : 'not a number'
              }
            </label>
            <div class="control">
              {amountInput}
            </div>
          </div>
          {
            <button
              disabled={typeof amountInt !== "number" || isNaN(amountInt) || typeof address !== 'string' || address.length === 0 || amountInt <= 0}
              className="button is-normal"
              onClick={() => {
                props.addOperations(
                  [{ "type": "TRANSFER_REV", "amount": amountInt, "recipient": address }], false
                )
              }}
            >Add REV transfer operation</button>
          }
        </>
      }
      {
        action === 'KICKOUT' &&
        <>
          <br />
          {
            props.members.map(m => {
              return <button
                type="button"
                className={'button is-text vote-kicking'}
                onClick={(e) => {
                  e.preventDefault();
                  props.addOperations([{ "type": "KICKOUT", "memberId": m }], false)
                }}
              >
                Kick out {m}
              </button>
            })
          }
        </>
      }
    </div>
  )
}
