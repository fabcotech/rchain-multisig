import React, { Fragment, useState } from 'react';

import { OperationsComponent } from './Operations';
import { ApplyComponent } from './Apply';
import { ProposedOperationsComponent } from './ProposedOperations';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const MultisigComponent = (props) => {
  const [kick, setKick] = useState(false);
  const [tab, setTab] = useState('main');

  return <>
  <h1 className="title main is-2">Multisig {props.multisigRegistryUri}</h1>
  {' '}
  <a onClick={(e) => {
    e.preventDefault();
    navigator.clipboard.writeText(props.multisigRegistryUri)
  }}>copy</a>
  {' '}
  { props.as && <span className="title-as">as {props.as}</span> }
  <div className="multisig">
    <button className="reload button" type="button" onClick={() => props.reload({})}>Reload</button>
    <div className="main">
      {<div className="tabs">
        <ul>
          <li
            className={tab === 'main' ? 'is-active' : ''}
            onClick={() => setTab('main')}
          ><a>Main</a></li>
          <li
            className={tab === 'operations' ? 'is-active' : ''}
            onClick={() => setTab('operations')}
          >
            <a>
              Pending operations{'  '}
              { props.operations.length > 0 && <span className="tag tag-rounded is-info">{props.operations.length}</span>}  
            </a>
          </li>
          <li
            className={tab === 'applications' ? 'is-active' : ''}
            onClick={() => setTab('applications')}
          >
            <a>
              Pending applications{'  '}
              { props.config.applications.length > 0 && <span className="tag is-light">{props.config.applications.length}</span>}
            </a>
          </li>
          <li
            className={tab === 'proposed' ? 'is-active' : ''}
            onClick={() => setTab('proposed')}
          >
            <a> Proposals{'  '}
            { Object.keys(props.proposedOperations).length > 0 && <span className="tag is-light">{Object.keys(props.proposedOperations).length}</span>}
            </a>
          </li>
          <li
            className={tab === 'apply' ? 'is-active' : ''}
            onClick={() => setTab('apply')}
          >
            <a>
              Apply
            </a>
          </li>
        </ul>
      </div>}
      {
        tab === 'main' &&
        <>
          <h3 className="title is-5"> REV address :</h3>
          <p>
            <span className="rev-address">{props.config.revAddress}{' '}</span>
            <a onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(props.config.revAddress)
            }}>copy</a>
          </p>
          <br />
          <h3 className="title is-5"> REV balance : {formatter.format(props.config.revBalance / 100000000).substr(1)}</h3>
          <h3 className="title is-5"> dust balance : {formatter.format(props.config.revBalance).substr(1, formatter.format(props.config.revBalance).length - 4)}</h3>
        </>
      }
      {
        tab === 'operations' &&
        <OperationsComponent
          operations={props.operations}
          removeOperation={props.removeOperation}
          proposeOperations={props.proposeOperations}
          proposedOperations={props.as && props.proposedOperations[props.as] ? props.proposedOperations[props.as] : []}
        />
      }
      {
        tab === 'apply' &&
        <ApplyComponent
          apply={props.apply}
          applyError={props.applyError}
        />
      }
    </div>
    {
      tab === 'main' &&
      <div className="members">
        <h3 className="title is-4">
          {
            props.config.members.length === 0 && 'No members yet'
          }
          {
            props.config.members.length === 1 && '1 Member'
          }
          {
            props.config.members.length > 1 && `Members (${props.config.members.length})`
          }
        </h3>
        <button
          type="button"
          className={'button is-text vote-kicking' + (kick ? ' active' : '')}
          onClick={(e) => {
            e.preventDefault();
            setKick(!kick)
          }}
        >
          { kick && 'Cancel' }
          { !kick && 'Start voting for kicking members out' }
        </button>
        <br />
        {props.config.members.map(m => {
          return (<p key={m} className="member">
            <b>{m}{' '}</b>
            {
              kick &&
              <button
                disabled={props.operations.find(o => o.type === 'KICKOUT' && o.memberId === m)}
                type="button"
                className="button is-small is-warning"
                onClick={(e) => {
                  e.preventDefault();
                  props.addOperations([{ "type": "KICKOUT", "memberId": m }], false)}
                }
              >
                kick
              </button>
            }
          </p>)
        })}
      </div>
    }
    {
      tab === 'proposed' &&
      <ProposedOperationsComponent
        addOperations={props.addOperations}
        members={props.config.members}
        proposedOperations={props.proposedOperations}
      />
    }
    {
      tab === 'applications' &&
      <div className="applications">
          {
            props.config.applications.length === 0 && <b>No applications yet</b>
          }
          {
            props.config.applications.length === 1 && <h3 className="title is-4">1 Application</h3>
          }
          {
            props.config.applications.length > 1 &&  <h3 className="title is-4">Applications ({props.config.applications.length})</h3>
          }
        <br />
        {props.config.applications.map(m => {
          return (<p key={m} className="application">
            <b>{m}{' '}</b>
              <button
                type="button"
                className="button is-small is-info"
                onClick={(e) => {
                  e.preventDefault();
                  props.addOperations([{ "type": "ACCEPT", "applicationId": m }], false)}
                }
              >
                accept
              </button>
              {' '}
              <button
                type="button"
                className="button is-small is-info"
                onClick={(e) => {
                  e.preventDefault();
                  props.addOperations([{ "type": "REJECT", "applicationId": m }], false)}
                }
              >
                reject
              </button>
            {
            }
          </p>)
        })}
      </div>
    }
  </div>
  </>;
}