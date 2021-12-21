const rchainToolkit = require('rchain-toolkit');
const { blake2b } = require("blakejs");

const { getKeyTerm } = require('../src/getKeyTerm');

const { log, getMultisigRegistryUri } = require('./utils');

module.exports.getKey = async () => {
  const publicKey = rchainToolkit.utils.publicKeyFromPrivateKey(
    process.env.PRIVATE_KEY
  );

  const multisigRegistryUri = getMultisigRegistryUri();

  const bufferToSign = Buffer.from(`rho:id:${multisigRegistryUri}`, "utf8");
  const uInt8Array = new Uint8Array(bufferToSign);
  const blake2bHash = blake2b(uInt8Array, 0, 32);
  const signature = rchainToolkit.utils.signSecp256k1(blake2bHash, process.env.PRIVATE_KEY);
  const signatureHex = Buffer.from(signature).toString("hex");

  const term = getKeyTerm({ multisigRegistryUri: multisigRegistryUri, signature: signatureHex, publicKey: publicKey });
  
  let dataAtNameResponse;
  try {
    dataAtNameResponse = await rchainToolkit.http.easyDeploy(
      process.env.VALIDATOR_HOST,
      term,
      process.env.PRIVATE_KEY,
      1,
      10000000,
      3 * 60 * 1000
    );
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }

  const data = rchainToolkit.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );
  if (data.status !== "completed") {
    console.log(data);
    process.exit();
  }
  log('✓ retrieved key from the multisig contract');
};
