const rchainToolkit = require('rchain-toolkit');
const fs = require('fs');

const { multisigTerm } = require('../src/multisigTerm');
const {
  log,
} = require('./utils');

module.exports.deployMultisigMint = async () => {
  if (typeof process.env.MULTISIG_MINT_REGISTRY_URI === 'string') {
    console.log('Please remove MULTISIG_MINT_REGISTRY_URI=* line in .env file');
    process.exit();
  }

  const term = multisigTerm();

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

  let envText = fs.readFileSync('./.env', 'utf8');
  envText += `\nMULTISIG_MINT_REGISTRY_URI=${data.registryUri.replace('rho:id:', '')}`;
  fs.writeFileSync('./.env', envText, 'utf8');
  log('✓ deployed multisig mint');
  log(
    `✓ updated .env file with MULTISIG_MINT_REGISTRY_URI=${data.registryUri.replace(
      'rho:id:',
      ''
    )}`
  );
};
