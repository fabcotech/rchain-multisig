const { multisigTerm } = require('./multisigTerm');
const { mintTerm } = require('./mintTerm');
const { applyTerm } = require('./applyTerm');
const { leaveTerm } = require('./leaveTerm');
const { proposeOperationsTerm } = require('./proposeOperationsTerm');
const { proposeOperationsChannelTerm } = require('./proposeOperationsChannelTerm');
const { readTerm } = require('./readTerm');
const { readLastExecutedOperationsTerm } = require('./readLastExecutedOperationsTerm');
const { readOperationsTerm } = require('./readOperationsTerm');

module.exports = {
  multisigTerm,
  mintTerm,
  applyTerm,
  leaveTerm,
  proposeOperationsTerm,
  proposeOperationsChannelTerm,
  readTerm,
  readLastExecutedOperationsTerm,
  readOperationsTerm,
}