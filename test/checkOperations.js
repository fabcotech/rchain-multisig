const rc = require('@fabcotech/rchain-toolkit');
const { readOperationsTerm } = require('../src/');

module.exports.main = async (multisigRegistryUri, hash, numberOfMembers) => {
  const term0 = readOperationsTerm({ multisigRegistryUri });
  const result0 = await rc.http.exploreDeploy(process.env.READ_ONLY_HOST, {
    term: term0,
  });

  let multisigOperations;
  multisigOperations = rc.utils.rhoValToJs(JSON.parse(result0).expr[0]);
  
  if (hash && !multisigOperations.proposals[hash]) {
    throw new Error("Hash not found in pending operations")
  }
  if (hash && multisigOperations.proposals[hash].length !== numberOfMembers) {
    console.log(multisigOperations.proposals[hash])
    throw new Error("Hash found in pending operations, but does not have the correct number of members")
  }

  return null;
};
