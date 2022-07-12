const rchainToolkit = require('@fabcotech/rchain-toolkit');

const { proposeOperationsTerm } = require('../src/proposeOperationsTerm');

const { log, getMultisigRegistryUri, getOperationsFile, getMemberId } = require('./utils');

require('dotenv').config();

const names = require('./getNames').getNames();

const proposeOperations = async () => {
  const multisigRegistryUri = getMultisigRegistryUri();
  const memberId = getMemberId();

  const operations =  { operations: [] };

  names.forEach(name => {
    operations.operations.push({
      type: 'ACCEPT',
      applicationId: name
    })
  });

  const term = proposeOperationsTerm({ multisigRegistryUri: multisigRegistryUri, operations: operations.operations, memberId: memberId });

  let dataAtNameResponse;
  try {
    dataAtNameResponse = await rchainToolkit.http.easyDeploy(
      process.env.VALIDATOR_HOST,
      {
        privateKey: process.env.PRIVATE_KEY,
        shardId: process.env.SHARD_ID,
        term: term,
        phloPrice: 1,
        phloLimit: 1000000000,
        timeout: 3 * 60 * 1000
      }
    );
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }

  const data = rchainToolkit.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );
  console.log(data);

  if (data.status !== "completed") {
    console.log(data);
    process.exit();
  }
  log('✓ ' + data.message);
};

proposeOperations()