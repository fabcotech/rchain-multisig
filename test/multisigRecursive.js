const rc = require('@fabcotech/rchain-toolkit');

require('dotenv').config();

const checkLastOperations = require('./checkLastOperations').main
const checkMembers = require('./checkMembers').main;
const deployMultisig = require('./test_deployMultisig').main;
const apply = require('./test_apply').main;
const transferRev = require('./transferRev').main
const mint = require('./test_mint').main;;
const proposeOperations = require('./test_proposeOperations').main;
const proposeOperationsChannel = require('./test_proposeOperationsChannel').main;
const { readTerm } = require('../src');

const PRIVATE_KEY1 = "28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36";
const PUBLIC_KEY1 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY1);
const ADDRESS1 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY1);
const APPLICATION_ID1 = PUBLIC_KEY1.slice(0, 5);

const PRIVATE_KEY2 = "5fa23a9d526129a294baa53cd26844f2a83cd52e44e723cef8c8f61f45a9b220";
const PUBLIC_KEY2 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY2);
const ADDRESS2 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY2);
const APPLICATION_ID2 = PUBLIC_KEY2.slice(0, 5);

const main = async () => {
  await transferRev(PRIVATE_KEY1, ADDRESS1, ADDRESS2, 1000000000);

  const result = await deployMultisig(PRIVATE_KEY1);
  const mintRegistryUri = result.registryUri.replace('rho:id:', '');

  const result2 = await mint(PRIVATE_KEY1, mintRegistryUri);
  const multisigRegistryUri = result2.registryUri.replace('rho:id:', '');

  /*
    Multisig 2 is empty, awaiting first application
  */
  const result3 = await mint(PRIVATE_KEY1, mintRegistryUri);
  const multisigRegistryUri2 = result3.registryUri.replace('rho:id:', '');

  /*
    Multisig 3 is used later, it has has one member (privatekey2), multisig1 will have to wait for privatekey2 to accept it
  */
  const result4 = await mint(PRIVATE_KEY1, mintRegistryUri);
  const multisigRegistryUri3 = result4.registryUri.replace('rho:id:', '');
  await apply(multisigRegistryUri3, PRIVATE_KEY2, APPLICATION_ID2);
  await proposeOperationsChannel(multisigRegistryUri3, PRIVATE_KEY2, APPLICATION_ID2);

  await apply(multisigRegistryUri, PRIVATE_KEY1, APPLICATION_ID1)
  await checkMembers(multisigRegistryUri, [APPLICATION_ID1])
  console.log('✓ First application validated, received its OCAP key')

  const proposalAcceptChannel = await proposeOperationsChannel(multisigRegistryUri, PRIVATE_KEY1, APPLICATION_ID1);
  console.log('✓ channel updated');

  /*
    multisig1 mint a new multisig and instantly applies to it
  */
  // "$BQ and $BQ" are replaced by a back quote `
  const operationsShouldBeAccepted = [
    { "type": "MINT_MULTISIG", "applicationId": "bob", "mintRegistryUri": `$BQrho:id:${mintRegistryUri}$BQ` },
  ];
  await proposeOperations(multisigRegistryUri, PRIVATE_KEY1, operationsShouldBeAccepted, APPLICATION_ID1);

  const term = readTerm({ multisigRegistryUri: multisigRegistryUri });
  const resultConfig1 = await rc.http.exploreDeploy(
    process.env.READ_ONLY_HOST,
    { term: term }
  );
  const config1 = rc.utils.rhoValToJs(JSON.parse(resultConfig1).expr[0]);
  if (!config1.multisigMemberships || Object.keys(config1.multisigMemberships).length !== 1) {
    console.log(config1.multisigMemberships);
    throw new Error('multisig1 is not part of any multisig');
  }

  if (config1.multisigMemberships['1'][1] !== "bob") {
    console.log(config1.multisigMemberships);
    throw new Error('multisig1 should be part of another (1) multisig with name bob');
  }

  await checkLastOperations(multisigRegistryUri, {
    "0": [true],
  })

  console.log('✓ multisig1 has minted a multisig and joined it');

  /*
    multisig1 joins empty multisig2, application is automatically accepted
  */
  const operationsShouldBeAccepted2 = [
    { "type": "JOIN_MULTISIG", "applicationId": "dan", "registryUri": `$BQrho:id:${multisigRegistryUri2}$BQ` },
  ];
  await proposeOperations(multisigRegistryUri, PRIVATE_KEY1, operationsShouldBeAccepted2, APPLICATION_ID1);

  const resultConfig2 = await rc.http.exploreDeploy(
    process.env.READ_ONLY_HOST,
    { term: term }
  );
  const config2 = rc.utils.rhoValToJs(JSON.parse(resultConfig2).expr[0]);
  if (!config2.multisigMemberships || Object.keys(config2.multisigMemberships).length !== 2) {
    console.log(config2.multisigMemberships);
    throw new Error('multisig is not part of two multisigs');
  }

  if (config2.multisigMemberships['2'][1] !== "dan") {
    console.log(config2.multisigMemberships);
    throw new Error('multisig should be part of another (2) multisig with name dan');
  }

  await checkLastOperations(multisigRegistryUri, {
    "0": [true, "application accepted"],
  });

  console.log('✓ multisig1 has joined an empty multisig');

  /*
    multisig1 tries to join multisig3, application should be
    recorded but not instantly validated, privatekey2 must accept it
  */
  const operationsShouldBeAccepted3 = [
    { "type": "JOIN_MULTISIG", "applicationId": "kim", "registryUri": `$BQrho:id:${multisigRegistryUri3}$BQ` },
  ];
  await proposeOperations(multisigRegistryUri, PRIVATE_KEY1, operationsShouldBeAccepted3, APPLICATION_ID1);

  const resultConfig3 = await rc.http.exploreDeploy(
    process.env.READ_ONLY_HOST,
    { term: term }
  );
  const config3 = rc.utils.rhoValToJs(JSON.parse(resultConfig3).expr[0]);
  if (!config3.multisigMemberships || Object.keys(config3.multisigMemberships).length !== 2) {
    console.log(config3.multisigMemberships);
    throw new Error('multisig should be part of only two multisigs');
  }

  await checkLastOperations(multisigRegistryUri, {
    "0": [true, "application registered"],
  });

  console.log('✓ multisig1 has applied to a 1 member multisig');

  /*
    privatekey2 accepts multisig1's application
  */
  const operationsShouldBeAccepted1 = [
    { "type": "ACCEPT", "applicationId": "kim" },
  ];
  await proposeOperations(multisigRegistryUri3, PRIVATE_KEY2, operationsShouldBeAccepted1, APPLICATION_ID2);

  const resultConfig4 = await rc.http.exploreDeploy(
    process.env.READ_ONLY_HOST,
    { term: term }
  );
  const config4 = rc.utils.rhoValToJs(JSON.parse(resultConfig4).expr[0]);
  if (!config4.multisigMemberships || Object.keys(config4.multisigMemberships).length !== 3) {
    console.log(config4.multisigMemberships);
    throw new Error('multisig should be part of three multisigs');
  }

  console.log('✓ multisig1 has been accepted to the 1 member multisig');
}

main();
