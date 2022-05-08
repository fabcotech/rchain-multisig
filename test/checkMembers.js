const rc = require('@fabcotech/rchain-toolkit');
const { readTerm } = require('../src');

module.exports.main = async (multisigRegistryUri, members) => {
  const term0 = readTerm({ multisigRegistryUri });
  const result0 = await rc.http.exploreDeploy(process.env.READ_ONLY_HOST, {
    term: term0,
  });
  const multisigMembers = rc.utils.rhoValToJs(JSON.parse(result0).expr[0]).members;

  members.forEach(m => {
    if (!multisigMembers.find(mm => mm === m)) {
      throw new Error("Missing member in multisig :" + m)
    }
  })

  return null;
};
