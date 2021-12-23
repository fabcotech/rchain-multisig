const rchainToolkit = require('rchain-toolkit');

const { readTerm } = require('../src/readTerm');

const { getMultisigRegistryUri } = require('./utils');

module.exports.read = async () => {
  const multisigRegistryUri = getMultisigRegistryUri();
  const term = readTerm({ multisigRegistryUri: multisigRegistryUri });

  const result1 = await rchainToolkit.http.exploreDeploy(
    process.env.READ_ONLY_HOST,
    {
      term: term,
    }
  );
  const config = rchainToolkit.utils.rhoValToJs(JSON.parse(result1).expr[0]);

console.log(config)
  console.log(``);
  console.log(`==== Multisig contract ====\n`);
  console.log(`Pending applications : ${config.applications.length} :  ${config.applications.join(', ')}`);
  console.log(`Multisig resitry URI : ${multisigRegistryUri} (not a REV address)`);
  console.log(`REV address          : ${config.revAddress}`);
  console.log(`REV balance          : ${config.revBalance} dust | ${Math.round(100 * parseInt(config.revBalance, 10) / 100000000) / 100} REV`);
  console.log(`Synchrony constraint : ${config.percentage}%`);

  console.log(``);
  console.log(`Members              :`);
  Object.keys(config.members).forEach(pk => {
    console.log(`  ${pk} : ${config.members[pk]}`)
  })
  console.log('\n')
};
