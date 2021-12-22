const rchainToolkit = require('rchain-toolkit');

const { readOperationsTerm } = require('../src/');

const { getMultisigRegistryUri, getPublicKey } = require('./utils');

module.exports.readOperations = async () => {

  const publicKey = getPublicKey()

  const multisigRegistryUri = getMultisigRegistryUri();
  const term = readOperationsTerm({ multisigRegistryUri: multisigRegistryUri, publicKey });

  const result1 = await rchainToolkit.http.exploreDeploy(
    process.env.READ_ONLY_HOST,
    {
      term: term,
    }
  );
  try {
    const operations = rchainToolkit.utils.rhoValToJs(JSON.parse(result1).expr[0]);
    console.log(JSON.stringify(operations, null, 2))
  } catch (err) {
    console.log('no operations')
  }
};
