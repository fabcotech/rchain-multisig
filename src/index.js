const { multisigTerm } = require('./multisigTerm');
const { applyTerm } = require('./applyTerm');
const { proposeOperationsTerm } = require('./proposeOperationsTerm');
const { readTerm } = require('./readTerm');
const { readLastExecutedOperationsTerm } = require('./readLastExecutedOperationsTerm');
const { readOperationsTerm } = require('./readOperationsTerm');

module.exports = {
  multisigTerm,
  applyTerm,
  proposeOperationsTerm,
  readTerm,
  readLastExecutedOperationsTerm,
  readOperationsTerm,
}