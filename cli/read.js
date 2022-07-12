const rchainToolkit = require('@fabcotech/rchain-toolkit');

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

  console.log(`\n==== Multisig contract ====\n`);
  console.log(`Version                        : ${config.version}`);
  console.log(`Multisig resitry URI           : ${multisigRegistryUri} (not a REV address)`);
  console.log(`REV address                    : ${config.revAddress}`);
  console.log(`REV balance                    : ${config.revBalance} dust | ${Math.round(100 * parseInt(config.revBalance, 10) / 100000000) / 100} REV`);
  console.log(`Synchrony constraint           : ${config.percentage}%\n`);

  console.log(`Members                        :`);
  Object.keys(config.members).forEach(pk => {
    console.log(`  ${config.members[pk]}`)
  });

  if (Object.keys(config.applications).length) {
    console.log(`\nPending applications (${Object.keys(config.applications).length})           :`);
    Object.keys(config.applications).forEach(pk => {
      console.log(`  ${config.applications[pk]}`)
    });

  }

  if (Object.keys(config.multisigMemberships).length > 0) {
    console.log(`\nMemberships in other multisigs :`);
    Object.keys(config.multisigMemberships).forEach(m => {
      console.log(`  ${config.multisigMemberships[m][0].replace('rho:id:', '')} as ${config.multisigMemberships[m][1]}`)
    });
  }

  console.log('\n')
};
