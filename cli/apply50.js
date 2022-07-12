const rchainToolkit = require('@fabcotech/rchain-toolkit');

require('dotenv').config();

const { applyTerm } = require('../src/');

const { log, getMultisigRegistryUri, getApplicationId } = require('./utils');

const names = require('./getNames').getNames();

const apply = async () => {
  const multisigRegistryUri = getMultisigRegistryUri();

  let term = 'new x in { Nil }'
  names.forEach(name => {
    term += `|
${applyTerm({ multisigRegistryUri: multisigRegistryUri, applicationId: name })}`
  })
  term = term
    .replaceAll('deployId(`rho:rchain:deployId`)', 'x')
    .replaceAll('deployId!', 'x!')
  
  let dataAtNameResponse;
  try {
    dataAtNameResponse = await rchainToolkit.http.easyDeploy(
      process.env.VALIDATOR_HOST,
      {
        privateKey: process.env.PRIVATE_KEY,
        shardId: process.env.SHARD_ID,
        term: term,
        phloPrice: 1,
        phloLimit: 10000000000,
        timeout: 3 * 60 * 1000
      }
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

apply()