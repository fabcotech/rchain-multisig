const rc = require('@fabcotech/rchain-toolkit');
const { readLastExecutedOperationsTerm } = require('../src/');

module.exports.main = async (multisigRegistryUri, lastOperations) => {
  const term0 = readLastExecutedOperationsTerm({ multisigRegistryUri });
  const result0 = await rc.http.exploreDeploy(process.env.READ_ONLY_HOST, {
    term: term0,
  });
  let multisigOperations;
  try {
    multisigOperations = rc.utils.rhoValToJs(JSON.parse(result0).expr[0]);
    console.log(multisigOperations)
  } catch (err) {
    if (lastOperations === null) {
      return null;
    } else {
      throw new Error('Could not check last operations')
    }
  }
  
  Object.keys(lastOperations).forEach(o => {
    if (!multisigOperations[o]) {
      throw new Error("Missing operation  :" + o)
    }
    if (multisigOperations[o].toString() !== lastOperations[o].toString()) {
      console.log('expected :')
      console.log(lastOperations);
      console.log('current :')
      console.log(multisigOperations);
      throw new Error("Operation result is wrong result " + o)
    }
  })

  return null;
};
