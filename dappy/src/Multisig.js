import React, { Fragment, useState } from 'react';

import { OperationsComponent } from './Operations';
import { ApplyComponent } from './Apply';
import { ProposedOperationsComponent } from './ProposedOperations';
import { ActionsComponent } from './Actions';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const MultisigComponent = (props) => {
  const [tab, setTab] = useState('main');

  return <>
  <div class="buttons">
    <button className="is-dark button" type="button" onClick={() => props.back()}>Back</button>{' '}
    <button disabled={props.reloading} className="is-dark button" type="button" onClick={() => props.reload({})}>{props.reloading ? 'Reloading' : 'Reload'}</button>
  </div>
  <br />
  <br />
  <h1 className="title main is-2">Multisig {props.multisigRegistryUri}</h1>
  {' '}
  <a onClick={(e) => {
    e.preventDefault();
    navigator.clipboard.writeText(props.multisigRegistryUri)
  }}>copy address</a>
  <br />
  {'Logged in as '}
  <input type="text" className="input asinput is-small" value={props.as} onChange={e => {
    props.setAs(e.target.value)
  }} ></input>
  <div className="multisig">
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
              Submitted applications{'  '}
              { props.config.applications.length > 0 && <span className="tag is-light">{props.config.applications.length}</span>}
            </a>
          </li>
          <li
            className={tab === 'proposed' ? 'is-active' : ''}
            onClick={() => setTab('proposed')}
          >
            <a> Pushed proposals{'  '}
            { props.proposedOperations &&  Object.keys(props.proposedOperations.proposals).length > 0 && <span className="tag is-light">{Object.keys(props.proposedOperations.proposals).length}</span>}
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
          as={props.as}
          operations={props.operations}
          removeOperation={props.removeOperation}
          proposeOperations={props.proposeOperations}
          proposedOperations={props.proposedOperations}
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
      <>
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
        {props.config.members.map(m => {
          return (<p key={m} className="member">
            <b>{m}{' '}</b>
          </p>)
        })}
      </div>
      <ActionsComponent
        members={props.config.members}
        addOperations={props.addOperations}
      />
      </>
    }
    {
      tab === 'proposed' &&
      <ProposedOperationsComponent
        as={props.as}
        addOperations={props.addOperations}
        members={props.config.members}
        proposedOperations={props.proposedOperations}
      />
    }
    {
      tab === 'applications' &&
      <div className="applications">
          {
            props.config.applications.length === 0 && <b>No applications submitted yet</b>
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
                disabled
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