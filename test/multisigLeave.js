const rc = require('rchain-toolkit');

const checkMembers = require('./checkMembers').main
const deployMultisig = require('./test_deployMultisig').main
const apply = require('./test_apply').main
const leave = require('./test_leave').main
const transferRev = require('./transferRev').main
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
  console.log('Starting tests, make sure those following REV addresses have REV :')
  console.log('(you may uncomment lines 40-42 to transfer REV)')
  console.log(ADDRESS1);
  console.log(ADDRESS2);

  /* await transferRev(PRIVATE_KEY1, ADDRESS1, ADDRESS2, 1000000000); */
  console.log('✓ Initialized tests with 3 REV transfers')

  const result = await deployMultisig(PRIVATE_KEY1);

  const multisigRegistryUri = result.registryUri.replace('rho:id:', '');

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
  let operationsGoingNowhere;
  try {
    operationsGoingNowhere = await proposeOperations(multisigRegistryUri, PRIVATE_KEY2, OPERATIONS_GOING_NOWHERE);
  } catch (err) {
    console.log('✓ User 2 has no capability anymore');
    process.exit()
    return;
  }
  console.log(operationsGoingNowhere);
  throw new Error('Operations should have been going nowhere')
}

main();
