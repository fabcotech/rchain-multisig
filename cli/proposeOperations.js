const rchainToolkit = require('@fabcotech/rchain-toolkit');

const { proposeOperationsTerm } = require('../src/proposeOperationsTerm');

const { log, getMultisigRegistryUri, getOperationsFile } = require('./utils');

module.exports.proposeOperations = async () => {
  const multisigRegistryUri = getMultisigRegistryUri();

  const operations =  JSON.parse(getOperationsFile());

  const term = proposeOperationsTerm({ multisigRegistryUri: multisigRegistryUri, operations: operations.operations });

  let dataAtNameResponse;
  try {
    dataAtNameResponse = await rchainToolkit.http.easyDeploy(
      process.env.VALIDATOR_HOST,
      {
        privateKey: process.env.PRIVATE_KEY,
        shardId: process.env.SHARD_ID,
        term: term,
        phloPrice: 1,
        phloLimit: 10000000,
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
