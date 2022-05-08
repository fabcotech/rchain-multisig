const rchainToolkit = require('@fabcotech/rchain-toolkit');

const { readLastExecutedOperationsTerm } = require('../src/readLastExecutedOperationsTerm');

const { getMultisigRegistryUri } = require('./utils');

module.exports.readLastExecutedOperations = async () => {
  const multisigRegistryUri = getMultisigRegistryUri();
  const term = readLastExecutedOperationsTerm({ multisigRegistryUri: multisigRegistryUri });

  const result1 = await rchainToolkit.http.exploreDeploy(
    process.env.READ_ONLY_HOST,
    {
      term: term,
    }
  );
  const config = rchainToolkit.utils.rhoValToJs(JSON.parse(result1).expr[0]);

  console.log(JSON.stringify(config, null, 2))
};
