const rchainToolkit = require('@fabcotech/rchain-toolkit');

const { proposeOperationsTerm } = require('../src/proposeOperationsTerm');

const { log, getMultisigRegistryUri, getOperationsFile, getMemberId } = require('./utils');

require('dotenv').config();

const names = require('./getNames').getNames();

const proposeOperations = async () => {
  const multisigRegistryUri = getMultisigRegistryUri();

  const operations =  { operations: [] };

  console.log('Will propose for ',  Math.floor(names.length / 3), 'members (around one third) !');
  
  let term = 'new x in { Nil }'
  names.slice(0, Math.floor(names.length / 3)).forEach(name => {
    term += `|
${proposeOperationsTerm({ multisigRegistryUri: multisigRegistryUri, operations: [{ type: 'TRANSFER_REV', amount: 1000, recipient: '1111Wbd8KLeWBVsxByF9iksJ4QRRjEF3nq1ScgAw7bMbtomxHsqqd' }], memberId: name })}
`
    operations.operations.push({
      type: 'ACCEPT',
      applicationId: name
    })
  });

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
  console.log(data);

  if (data.status !== "completed") {
    console.log(data);
    process.exit();
  }
  log('✓ ' + data.message);
};

proposeOperations()