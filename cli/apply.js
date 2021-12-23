const rchainToolkit = require('rchain-toolkit');

const { applyTerm } = require('../src/');

const { log, getMultisigRegistryUri, getApplicationId } = require('./utils');

module.exports.apply = async () => {
  const multisigRegistryUri = getMultisigRegistryUri();
  const applicationId = getApplicationId();

  const term = applyTerm({ multisigRegistryUri: multisigRegistryUri, applicationId: applicationId });
  
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
