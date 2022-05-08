const rc = require('@fabcotech/rchain-toolkit');
const { readTerm } = require('../src/');

module.exports.main = async (multisigRegistryUri, balance) => {
  const term0 = readTerm({ multisigRegistryUri });
  const result0 = await rc.http.exploreDeploy(process.env.READ_ONLY_HOST, {
    term: term0,
  });
  let multisigBalance = rc.utils.rhoValToJs(JSON.parse(result0).expr[0]).revBalance;
  
  if (multisigBalance !== balance) {
    throw new Error("Wrong balance multisig, current :" + multisigBalance + " expected :" + balance)
  }

  return null;
};
