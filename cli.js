const { deployMultisig } = require('./cli/deployMultisig');
const { apply } = require('./cli/apply');
const { proposeOperations } = require('./cli/proposeOperations');
const { read } = require('./cli/read');
const { readLastExecutedOperations } = require('./cli/readLastExecutedOperations');
const { readOperations } = require('./cli/readOperations');

const { log } = require('./cli/utils');

require('dotenv').config();

const errorInEnv = () => {
  log(`The .env file is invalid, please make sure that it has the following values:
READ_ONLY_HOST=
VALIDATOR_HOST=
PRIVATE_KEY=
`);
};

const main = async () => {
  if (
    typeof process.env.READ_ONLY_HOST !== 'string' ||
    typeof process.env.VALIDATOR_HOST !== 'string' ||
    typeof process.env.PRIVATE_KEY !== 'string'
  ) {
    errorInEnv();
    return;
  }

  const viewArg = process.argv.findIndex((arg) => arg === 'view') !== -1;
  if (viewArg) {
    view();
    return;
  }

  const deployMultisigArg =
    process.argv.findIndex((arg) => arg === 'deploy-multisig') !== -1;
  if (deployMultisigArg) {
    deployMultisig();
    return;
  }

  const applyArg =
    process.argv.findIndex((arg) => arg === 'apply') !== -1;
  if (applyArg) {
    apply();
    return;
  }

  const proposeOperationsArg =
  process.argv.findIndex((arg) => arg === 'propose-operations') !== -1;
  if (proposeOperationsArg) {
    proposeOperations();
    return;
  }

  const readArg =
  process.argv.findIndex((arg) => arg === 'read') !== -1;
  if (readArg) {
    read();
    return;
  }

  const readLastExecutedOperationsArg =
  process.argv.findIndex((arg) => arg === 'last-operations') !== -1;
  if (readLastExecutedOperationsArg) {
    readLastExecutedOperations();
    return;
  }

  const readOperationsArg =
  process.argv.findIndex((arg) => arg === 'operations') !== -1;
  if (readOperationsArg) {
    readOperations();
    return;
  }

  throw new Error('unknown command');
};

main();
