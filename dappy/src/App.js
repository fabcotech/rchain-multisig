import React from 'react';
import { readTerm } from '../../src/readTerm';
import { readOperationsTerm } from '../../src/readOperationsTerm';
import { proposeOperationsTerm } from '../../src/proposeOperationsTerm';
import { mintAndApplyAndProposeTerm } from '../../src/mintAndApplyAndProposeTerm';
import { applyTerm } from '../../src/applyTerm';

import { LoadComponent } from './Load'
import { MultisigComponent } from './Multisig'

const SUPPORTED_VERSION = "0.1.0";
// testnet
const MULTISIG_MINT_REGISTRY_URI = "uht1khkk6sske1xmku91k6occcfpm4crqzyugj56jkt1xmdar9nr3t";
// local
//const MULTISIG_MINT_REGISTRY_URI = "dnx8tatikpj6onuc9tkoeido1z5t9ij1crzojdrc7n6pn9b93tc4dp";

export const hashCode = function(s) {
  var hash = 0, i, chr, len;
  if (s.length === 0) return hash;
  for (i = 0, len = s.length; i < len; i++) {
    chr   = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const orderAndUniqueOperations = (operations, operation) => {
  let os = operations.concat([]);
  if (os.find(o => JSON.stringify(o) === JSON.stringify(operation))) {
    return os;
  }
  if (operation.type === 'REJECT') {
    os = os.filter(o => !(o.type === 'ACCEPT' && o.applicationId === operation.applicationId))
  }
  if (operation.type === 'ACCEPT') {
    os = os.filter(o => !(o.type === 'REJECT' && o.applicationId === operation.applicationId))
  }

  return os.concat(operation).sort((a, b) => {
    if (hashCode(JSON.stringify(a)) > hashCode(JSON.stringify(b))) {
      return 1
    } else {
      return -1
    }
  });
}
export class AppComponent extends React.Component {

  constructor(props) {
    super(props);
    let defaultAddress = '';
    const urlParams = new URLSearchParams(window.location.search);
    const address = urlParams.get('address');
    if (typeof address === 'string' && address.length === 54) {
      defaultAddress = address;
    }

    window.dappyRChain = new DappyRChain();
    window.dappyRChain.addEventListenner((e) => {
      console.log(e)
      if (e.val.registryUri) {
        this.setState({
          deployedMultisigs: this.state.deployedMultisigs.concat(e.val.registryUri.replace('rho:id:', '')),
          deploying: false,
        })
      }
    })
    this.rchainWeb = new RChainWeb.http({
      readOnlyHost: "dappynetwork://",
      validatorHost: "dappynetwork://",
    })
    this.state = {
      loadError: '',
      loading: false,
      reloading: false,
      operations: [],
      deployedMultisigs: [],
      proposedOperations: {},
      config: undefined,
    }
    if (defaultAddress) {
      this.load({
        uri: defaultAddress
      })
    }
  }

  deploy = ({ as }) => {
    this.setState({
      deploying: true,
    });
    const term = mintAndApplyAndProposeTerm({
      mintMultisigRegistryUri: MULTISIG_MINT_REGISTRY_URI,
      applicationId: as,
      memberId: as
    });
    window.dappyRChain
      .sendTransaction({
        term: term,
        signatures: {},
      })
      .then((a) => {
        console.log(a);
        this.setState({
          deploying: false,
        });
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          deploying: false,
        });
      });
  }

  load = ({ uri, as }) => {
    let term = readTerm({
      multisigRegistryUri: uri || this.state.multisigRegistryUri,
    });
    let term2 = readOperationsTerm({
      multisigRegistryUri: uri || this.state.multisigRegistryUri,
    });

    this.rchainWeb.exploreDeploys([term, term2], false)
      .then(a => {
        if (
          a.results && a.results[0] && a.results[0].success &&
          a.results && a.results[1] && a.results[1].success
        ) {
          const data = RChainWeb.utils.rhoValToJs(JSON.parse(a.results[0].data).expr[0]);
          const data2 = RChainWeb.utils.rhoValToJs(JSON.parse(a.results[1].data).expr[0]);

          if (data.version === SUPPORTED_VERSION) {
            this.setState({
              as: as || this.state.as,
              multisigRegistryUri: uri || this.state.multisigRegistryUri,
              config: data,
              proposedOperations: data2,
              // if it is a reload, do not reset operations
              operations: uri ? [] : this.state.operations,
              loadError: '',
              loading: false,
              reloading: false,
            });
          } else {
            const e = 'Unsupported version, current : ' + data.version + ', exepected : ' + SUPPORTED_VERSION
            console.error(e);
            this.setState({
              multisigRegistryUri: undefined,
              operations: [],
              config: undefined,
              loadError: e,
              loading: false,
              reloading: false,
            }) 
          }
        } else {
          console.error('Could not load multisig');
          this.setState({
            loadError: 'Could not load multisig',
            loading: false,
            reloading: false,
          })
        }
      })
      .catch(err => {
        console.error(err);
        this.setState({
          loadError: 'Could not find multisig',
          loading: false,
          reloading: false,
        })
      })
  }

  render() {
    if (this.state.config) {
      return (
        <MultisigComponent
          as={this.state.as}
          reloading={this.state.reloading}
          loading={this.state.loading}
          setAs = {(as) => {
            this.setState({ as })
          }}
          back={() => {
            this.setState({
              loadError: '',
              loading: false,
              reloading: false,
              operations: [],
              deployedMultisigs: [],
              proposedOperations: {},
              config: undefined,
            });
          }}
          reload={(a) => {
            this.setState({ reloading: true });
            this.load(a);
          }}
          multisigRegistryUri={this.state.multisigRegistryUri}
          proposedOperations={this.state.proposedOperations}
          operations={this.state.operations}
          config={this.state.config}
          removeOperation={i => {
            this.setState({
              operations: this.state.operations.slice(0, i).concat(this.state.operations.slice(i + 1)),
            }) 
          }}
          addOperations={(operations, eraseAll) => {
            if (eraseAll) {
              this.setState({
                operations: operations
              });
              return;
            }
            let os = this.state.operations;
            operations.forEach(o => {
              os = orderAndUniqueOperations(os, o)
            });
            this.setState({
              operations: os
            })
          }}
          proposeOperations={(operations) => {
            this.setState({
              operations: [],
            });
            window.dappyRChain
              .sendTransaction({
                term: proposeOperationsTerm({
                  multisigRegistryUri: this.state.multisigRegistryUri,
                  operations: operations === null ? null : this.state.operations,
                  memberId: this.state.as,
                }),
                signatures: {},
              })
              .then((a) => {
                console.log(a);
                this.setState({
                  operations: [],
                });
              });
          }}
          apply={(a) => {
            window.dappyRChain
              .sendTransaction({
                term: applyTerm({
                  multisigRegistryUri: this.state.multisigRegistryUri,
                  applicationId: a.as,
                }),
                signatures: {},
              })
              .then((a) => {
                console.log(a);
              });
          }}
        />
      )
    };

    return (
      <div>
        <LoadComponent
          loadError={this.state.loadError}
          load={(a) => {
            this.setState({
              loading: true,
            });
            this.load(a);
          }}
          deployedMultisigs={this.state.deployedMultisigs}
          deploy={this.deploy}
          deploying={this.state.deploying}
          loading={this.state.loading}
        />
      </div>
    );
  }
}
