const rc = require('@fabcotech/rchain-toolkit');

require('dotenv').config();

const checkMembers = require('./checkMembers').main
const deployMultisig = require('./test_deployMultisig').main
const apply = require('./test_apply').main
const leave = require('./test_leave').main
const transferRev = require('./transferRev').main
const mint = require('./test_mint').main;
const proposeOperations = require('./test_proposeOperations').main
const proposeOperationsChannel = require('./test_proposeOperationsChannel').main

const PRIVATE_KEY1 = "28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36"
const PUBLIC_KEY1 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY1);
const ADDRESS1 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY1);
const APPLICATION_ID1 = PUBLIC_KEY1.slice(0, 5);

const PRIVATE_KEY2 = "5fa23a9d526129a294baa53cd26844f2a83cd52e44e723cef8c8f61f45a9b220"
const PUBLIC_KEY2 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY2);
const ADDRESS2 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY2);
const APPLICATION_ID2 = PUBLIC_KEY2.slice(0, 5);

const main = async () => {
  await transferRev(PRIVATE_KEY1, ADDRESS1, ADDRESS2, 1000000000);

  const result = await deployMultisig(PRIVATE_KEY1);
  const mintRegistryUri = result.registryUri.replace('rho:id:', '');

  const result2 = await mint(PRIVATE_KEY1, mintRegistryUri);
  const multisigRegistryUri = result2.registryUri.replace('rho:id:', '');

  await apply(multisigRegistryUri, PRIVATE_KEY1, APPLICATION_ID1)
  await checkMembers(multisigRegistryUri, [APPLICATION_ID1])
  console.log('✓ First application validated, received its OCAP key')

  const proposalAcceptChannel = await proposeOperationsChannel(multisigRegistryUri, PRIVATE_KEY1);
  console.log('✓ channel updated');

  await apply(multisigRegistryUri, PRIVATE_KEY2, APPLICATION_ID2)

  const operationsShouldBeAccepted = [
    { "type": "ACCEPT", "applicationId": "doesnotexist" },
    { "type": "ACCEPT", "applicationId": APPLICATION_ID2 },
  ];
  const operationsShouldBeAcceptedResult = await proposeOperations(multisigRegistryUri, PRIVATE_KEY1, operationsShouldBeAccepted);

  console.log('operationsShouldBeAcceptedResult', operationsShouldBeAcceptedResult);
  await checkMembers(multisigRegistryUri, [APPLICATION_ID1, APPLICATION_ID2])
  console.log('✓ User 2 has joined the multisig');

  await leave(multisigRegistryUri, PRIVATE_KEY2);
  await checkMembers(multisigRegistryUri, [APPLICATION_ID1])
  console.log('✓ User 2 left the multisig');

  const OPERATIONS_GOING_NOWHERE = [
    { "type": "ACCEPT", "applicationId": "doesnotexist" }
  ];

  proposeOperations(multisigRegistryUri, PRIVATE_KEY2, OPERATIONS_GOING_NOWHERE)
    .then(() => {
      throw new Error('Operations should have gone nowhere')
    })
    .catch(err => {
      console.log('✓ User 2 has no capability anymore');
      process.exit()
    })
}

main();
