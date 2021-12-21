const rchainToolkit = require('rchain-toolkit');
const fs = require('fs');

const { multisigTerm } = require('../src/multisigTerm');
const {
  log,
  getPublicKeys,
} = require('./utils');

module.exports.deployMultisig = async () => {
  if (typeof process.env.MASTER_REGISTRY_URI === 'string') {
    console.log('Please remove MASTER_REGISTRY_URI=* line in .env file');
    process.exit();
  }

  const term = multisigTerm({ publicKeys: getPublicKeys() });

  let dataAtNameResponse;
  try {
    dataAtNameResponse = await rchainToolkit.http.easyDeploy(
      process.env.VALIDATOR_HOST,
      term,
      process.env.PRIVATE_KEY,
      1,
      10000000,
      10 * 60 * 1000
    );
    console.log(dataAtNameResponse)
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  log('✓ deploy');

  const data = rchainToolkit.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );
  console.log(data);
  let envText = fs.readFileSync('./.env', 'utf8');
  envText += `\nMULTISIG_REGISTRY_URI=${data.registryUri.replace('rho:id:', '')}`;
  fs.writeFileSync('./.env', envText, 'utf8');
  log('✓ deployed multisig and retrieved data from the blockchain');
  log(
    `✓ updated .env file with MULTISIG_REGISTRY_URI=${data.registryUri.replace(
      'rho:id:',
      ''
    )}`
  );
};
