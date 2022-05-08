const rc = require('@fabcotech/rchain-toolkit');
const { readTerm } = require('../src/');

module.exports.main = async (multisigRegistryUri, publicKeys) => {
  const term0 = readTerm({ multisigRegistryUri });
  const result0 = await rc.http.exploreDeploy(process.env.READ_ONLY_HOST, {
    term: term0,
  });

  return rc.utils.rhoValToJs(JSON.parse(result0).expr[0]).revAddress;

};
