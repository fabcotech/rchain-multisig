const { getKeyTerm } = require('../src');
const rc = require('rchain-toolkit');
const { blake2b } = require("blakejs");

module.exports.main = async (
  multisigRegistryUri,
  privateKey,
  publicKey,
) => {

  const bufferToSign = Buffer.from(`rho:id:${multisigRegistryUri}`, "utf8");
  const uInt8Array = new Uint8Array(bufferToSign);
  const blake2bHash = blake2b(uInt8Array, 0, 32);
  const signature = rc.utils.signSecp256k1(blake2bHash, privateKey);
  const signatureHex = Buffer.from(signature).toString("hex");

  const term = getKeyTerm({
    multisigRegistryUri: multisigRegistryUri,
    publicKey: publicKey,
    signature: signatureHex,
  });

  let dataAtNameResponse;
  try {
    dataAtNameResponse = await rc.http.easyDeploy(
      process.env.VALIDATOR_HOST,
      term,
      privateKey,
      1,
      1000000000,
      400000
    );
  } catch (err) {
    console.log(err);
    throw new Error('get key 01');
  }

  const data = rc.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );

  if (data.status !== 'completed') {
    console.log(data);
    throw new Error('get key 02');
  }

  return data;
};
