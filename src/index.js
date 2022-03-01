const { multisigTerm } = require('./multisigTerm');
const { applyTerm } = require('./applyTerm');
const { leaveTerm } = require('./leaveTerm');
const { proposeOperationsTerm } = require('./proposeOperationsTerm');
const { proposeOperationsChannelTerm } = require('./proposeOperationsChannelTerm');
const { readTerm } = require('./readTerm');
const { readLastExecutedOperationsTerm } = require('./readLastExecutedOperationsTerm');
const { readOperationsTerm } = require('./readOperationsTerm');

module.exports = {
  multisigTerm,
  applyTerm,
  leaveTerm,
  proposeOperationsTerm,
  proposeOperationsChannelTerm,
  readTerm,
  readLastExecutedOperationsTerm,
  readOperationsTerm,
}