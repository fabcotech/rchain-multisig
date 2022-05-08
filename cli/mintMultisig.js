const rchainToolkit = require('@fabcotech/rchain-toolkit');
const fs = require('fs');

const { mintTerm } = require('../src/');
const {
  log,
} = require('./utils');

module.exports.mintMultisig = async () => {
  if (typeof process.env.MULTISIG_MINT_REGISTRY_URI !== 'string') {
    console.log('Please reploy a multisig mint first, or reference MULTISIG_MINT_REGISTRY_URI in .env file');
    process.exit();
  }
  if (typeof process.env.MULTISIG_REGISTRY_URI === 'string') {
    console.log('Please remove MULTISIG_REGISTRY_URI=* line in .env file');
    process.exit();
  }

  const term = mintTerm( {
    mintMultisigRegistryUri: process.env.MULTISIG_MINT_REGISTRY_URI
  });

  let dataAtNameResponse;
  try {
    dataAtNameResponse = await rchainToolkit.http.easyDeploy(
      process.env.VALIDATOR_HOST,
      {
        privateKey: process.env.PRIVATE_KEY,
        shardId: process.env.SHARD_ID,
        term: term,
        phloPrice: 1,
        phloLimit: 10000000,
        timeout: 3 * 60 * 1000
      }
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
  envText += `\nMULTISIG_REGISTRY_URI=${data.registryUri.replace('rho:id:', '')}`;
  fs.writeFileSync('./.env', envText, 'utf8');
  log('✓ deployed multisig');
  log(
    `✓ updated .env file with MULTISIG_REGISTRY_URI=${data.registryUri.replace(
      'rho:id:',
      ''
    )}`
  );
};
