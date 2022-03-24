const { deployMultisigMint } = require('./cli/deployMultisigMint');
const { mintMultisig } = require('./cli/mintMultisig');
const { apply } = require('./cli/apply');
const { proposeOperations } = require('./cli/proposeOperations');
const { proposeOperationsChannel } = require('./cli/proposeOperationsChannel');
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

  const mintMultisigArg =
    process.argv.findIndex((arg) => arg === 'mint-multisig') !== -1;
  if (mintMultisigArg) {
    mintMultisig();
    return;
  }

  const deployMultisigMintArg =
    process.argv.findIndex((arg) => arg === 'deploy-multisig-mint') !== -1;
  if (deployMultisigMintArg) {
    deployMultisigMint();
    return;
  }

  const applyArg =
    process.argv.findIndex((arg) => arg === 'apply') !== -1;
  if (applyArg) {
    apply();
    return;
  }

  const proposeOperationsChannelArg =
  process.argv.findIndex((arg) => arg === 'propose-operations-channel') !== -1;
  if (proposeOperationsChannelArg) {
    proposeOperationsChannel();
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
