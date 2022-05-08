const { multisigTerm } = require('../src');
const rc = require('@fabcotech/rchain-toolkit');

module.exports.main = async (
  privateKey
) => {
  const term = multisigTerm();

  let dataAtNameResponse;
  try {
    dataAtNameResponse = await rc.http.easyDeploy(
      process.env.VALIDATOR_HOST,
      {
        privateKey: privateKey,
        shardId: process.env.SHARD_ID,
        term: term,
        phloPrice: 1,
        phloLimit: 10000000,
        timeout: 3 * 60 * 1000
      }
    );
  } catch (err) {
    console.log(err);
    throw new Error('deploy 01');
  }

  const data = rc.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );

  if (data.status !== 'completed') {
    console.log(data);
    throw new Error('deploy 02');
  }

  return data;
};
