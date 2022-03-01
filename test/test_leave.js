const { leaveTerm } = require('../src');
const rc = require('rchain-toolkit');

module.exports.main = async (
  multisigRegistryUri,
  privateKey
) => {

  const term = leaveTerm({
    multisigRegistryUri: multisigRegistryUri
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
    throw new Error('leave 01');
  }

  const data = rc.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );
  console.log(data);

  if (data.status !== 'completed') {
    console.log(data);
    throw new Error('leave 02');
  }

  return data;
};
