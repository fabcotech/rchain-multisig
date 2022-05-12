const { multisigTerm } = require('./multisigTerm');
const { mintTerm } = require('./mintTerm');
const { applyTerm } = require('./applyTerm');
const { leaveTerm } = require('./leaveTerm');
const { proposeOperationsTerm } = require('./proposeOperationsTerm');
const { proposeOperationsChannelTerm } = require('./proposeOperationsChannelTerm');
const { readTerm } = require('./readTerm');
const { readLastExecutedOperationsTerm } = require('./readLastExecutedOperationsTerm');
const { readOperationsTerm } = require('./readOperationsTerm');
const { mintAndApplyAndProposeTerm } = require('./mintAndApplyAndProposeTerm');

module.exports = {
  multisigTerm,
  mintTerm,
  applyTerm,
  leaveTerm,
  mintAndApplyAndProposeTerm,
  proposeOperationsTerm,
  proposeOperationsChannelTerm,
  readTerm,
  readLastExecutedOperationsTerm,
  readOperationsTerm,
}