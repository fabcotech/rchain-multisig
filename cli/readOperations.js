const rchainToolkit = require('@fabcotech/rchain-toolkit');

const { readOperationsTerm } = require('../src/');

const { getMultisigRegistryUri, getMemberId } = require('./utils');

module.exports.readOperations = async () => {

  const multisigRegistryUri = getMultisigRegistryUri();
  const term = readOperationsTerm({ multisigRegistryUri: multisigRegistryUri });
  const result1 = await rchainToolkit.http.exploreDeploy(
    process.env.READ_ONLY_HOST,
    {
      term: term,
    }
  );

  try {
    const operations = rchainToolkit.utils.rhoValToJs(JSON.parse(result1).expr[0]);

    console.log(Object.keys(operations.proposals).length, 'proposal(s)')
    Object.keys(operations.proposals).forEach(k => {
      console.log(k.slice(0,5), ' : ', operations.proposals[k].length, 'member(s)')
      console.log(JSON.stringify(operations.operations[k], null, 1))
    });
  } catch (err) {
    console.log('no operations')
  }
};
