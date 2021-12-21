const { multisigTerm } = require('./multisigTerm');
const { getKeyTerm } = require('./getKeyTerm');
const { proposeOperationsTerm } = require('./proposeOperationsTerm');
const { readTerm } = require('./readTerm');
const { readLastExecutedOperationsTerm } = require('./readLastExecutedOperationsTerm');

module.exports = {
  multisigTerm,
  getKeyTerm,
  proposeOperationsTerm,
  readTerm,
  readLastExecutedOperationsTerm,
}