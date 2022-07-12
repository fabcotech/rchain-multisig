const rc = require('@fabcotech/rchain-toolkit');

require('dotenv').config();

const checkLastOperations = require('./checkLastOperations').main;
const checkMembers = require('./checkMembers').main;
const checkOperations = require('./checkOperations').main;
const transferRev = require('./transferRev').main
const deployMultisig = require('./test_deployMultisig').main;
const apply = require('./test_apply').main;
const mint = require('./test_mint').main;
const proposeOperations = require('./test_proposeOperations').main;
const proposeOperationsChannel = require('./test_proposeOperationsChannel').main;

const PRIVATE_KEY1 = "28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36"
const PUBLIC_KEY1 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY1);
const ADDRESS1 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY1);
const APPLICATION_ID1 = PUBLIC_KEY1.slice(0, 5);

const PRIVATE_KEY2 = "5fa23a9d526129a294baa53cd26844f2a83cd52e44e723cef8c8f61f45a9b220"
const PUBLIC_KEY2 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY2);
const ADDRESS2 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY2);
const APPLICATION_ID2 = PUBLIC_KEY2.slice(0, 5);

const PRIVATE_KEY3 = "62dce7c35de80ba4bbdebc2653d3ca4d7b46454a7b7a992ef36593f5a0c81b31"
const PUBLIC_KEY3 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY3);
const ADDRESS3 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY3);
const APPLICATION_ID3 = PUBLIC_KEY3.slice(0, 5);

const PRIVATE_KEY4 = "f17f45faaceb506f27eb7fded347319220081cbbb053a7c34ebc6d21707442c6"
const PUBLIC_KEY4 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY4);
const ADDRESS4 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY4);
const APPLICATION_ID4 = PUBLIC_KEY4.slice(0, 5);

const main = async () => {
  await transferRev(PRIVATE_KEY1, ADDRESS1, ADDRESS2, 1000000000);

  const result = await deployMultisig(PRIVATE_KEY1);
  const mintRegistryUri = result.registryUri.replace('rho:id:', '');

  const result2 = await mint(PRIVATE_KEY1, mintRegistryUri);
  const multisigRegistryUri = result2.registryUri.replace('rho:id:', '');

  await apply(multisigRegistryUri, PRIVATE_KEY1, APPLICATION_ID1)
  await checkMembers(multisigRegistryUri, [APPLICATION_ID1])
  console.log('✓ First application validated, received its OCAP key')

  const proposalAcceptChannel = await proposeOperationsChannel(multisigRegistryUri, PRIVATE_KEY1, APPLICATION_ID1);
  console.log('✓ channel updated');

  await apply(multisigRegistryUri, PRIVATE_KEY2, APPLICATION_ID2)
  await apply(multisigRegistryUri, PRIVATE_KEY3, APPLICATION_ID3)
  await apply(multisigRegistryUri, PRIVATE_KEY4, APPLICATION_ID4)

  const operationsShouldBeAccepted = [
    { "type": "ACCEPT", "applicationId": APPLICATION_ID2 },
    { "type": "ACCEPT", "applicationId": APPLICATION_ID3 },
    { "type": "ACCEPT", "applicationId": APPLICATION_ID4 }
  ];
  const operationsShouldBeAcceptedResult = await proposeOperations(multisigRegistryUri, PRIVATE_KEY1, operationsShouldBeAccepted, APPLICATION_ID1);
  await checkLastOperations(multisigRegistryUri, {
    "0": [true, "application accepted"],
    "1": [true, "application accepted"],
    "2": [true, "application accepted"],
  })
  await checkMembers(multisigRegistryUri, [APPLICATION_ID1, APPLICATION_ID2, APPLICATION_ID3]);
  console.log('✓ All 4 identities are registered got their OCAP keys')

  const operationsA = [
    { "type": "ACCEPT", "applicationId": "a" },
  ];
  const operationsAProposed = await proposeOperations(multisigRegistryUri, PRIVATE_KEY1, operationsA, APPLICATION_ID1);

  await checkOperations(multisigRegistryUri, "05dee4d91376f2de0d0d76c50fa0a8ef271816cd846f6ce6407d5e181b94c2d1", 1);
  console.log('✓ operations A proposed');

  const operationsB = [
    { "type": "ACCEPT", "applicationId": "b" },
  ];
  const operationsBProposed = await proposeOperations(multisigRegistryUri, PRIVATE_KEY1, operationsB, APPLICATION_ID1);

  await checkOperations(multisigRegistryUri, "2d59196b3c3228c0040965290456c9af56ace5facd6ab5ba0937d0399d24d1ca", 1);
  console.log('✓ operations B proposed');
}

main();
