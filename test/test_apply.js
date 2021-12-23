const { applyTerm } = require('../src');
const rc = require('rchain-toolkit');

module.exports.main = async (
  multisigRegistryUri,
  privateKey,
  applicationId,
) => {

  const term = applyTerm({
    multisigRegistryUri: multisigRegistryUri,
    applicationId: applicationId,
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
  console.log(data);

  if (data.status !== 'completed') {
    console.log(data);
    throw new Error('get key 02');
  }

  return data;
};
