const rchainToolkit = require('rchain-toolkit');

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
      term,
      process.env.PRIVATE_KEY,
      1,
      10000000,
      3 * 60 * 1000
    );
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }

  const data = rchainToolkit.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );
  console.log(data)
  if (data.status !== "completed") {
    console.log(data);
    process.exit();
  }
  log('✓ ' + data.message);
};
