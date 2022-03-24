const { proposeOperationsTerm } = require('../src/');
const rc = require('rchain-toolkit');

module.exports.main = async (
  multisigRegistryUri,
  privateKey,
  operations
) => {
  const term = proposeOperationsTerm({
    multisigRegistryUri: multisigRegistryUri,
    operations: operations,
  });

  let dataAtNameResponse;
  try {
    dataAtNameResponse = await rc.http.easyDeploy(
      process.env.VALIDATOR_HOST,
      term,
      privateKey,
      1,
      1000000000,
      40000
    );
  } catch (err) {
    console.log(err);
    throw err;
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
