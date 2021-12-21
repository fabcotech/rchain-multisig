const rc = require('rchain-toolkit');
const { readTerm } = require('../src/');

module.exports.main = async (multisigRegistryUri, publicKeys) => {
  const term0 = readTerm({ multisigRegistryUri });
  const result0 = await rc.http.exploreDeploy(process.env.READ_ONLY_HOST, {
    term: term0,
  });
  const multisigPublicKeys = rc.utils.rhoValToJs(JSON.parse(result0).expr[0]).publicKeys;
  Object.keys(publicKeys).forEach(pk => {
    if (!multisigPublicKeys[pk]) {
      throw new Error("Missing public key in multisig :" + pk)
    }
    if (multisigPublicKeys[pk] !== publicKeys[pk]) {
      throw new Error("Public key in multisig has wrong status, expected :" + pk + " : " + publicKeys[pk])
    }
  })

  return null;
};
