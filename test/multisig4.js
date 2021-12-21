const rc = require('rchain-toolkit');

const checkLastOperations = require('./checkLastOperations').main
const transferRev = require('./transferRev').main
const getRevAddress = require('./getRevAddress').main
const checkMultisigBalance = require('./checkMultisigBalance').main
const checkPublicKeys = require('./checkPublicKeys').main
const getBalance = require('./getBalance').main
const deployMultisig = require('./test_deployMultisig').main
const getKey = require('./test_getKey').main
const proposeOperations = require('./test_proposeOperations').main

const PRIVATE_KEY1 = "28a5c9ac133b4449ca38e9bdf7cacdce31079ef6b3ac2f0a080af83ecff98b36"
const PUBLIC_KEY1 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY1);
const ADDRESS1 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY1);

const PRIVATE_KEY2 = "5fa23a9d526129a294baa53cd26844f2a83cd52e44e723cef8c8f61f45a9b220"
const PUBLIC_KEY2 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY2);
const ADDRESS2 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY2);

const PRIVATE_KEY3 = "62dce7c35de80ba4bbdebc2653d3ca4d7b46454a7b7a992ef36593f5a0c81b31"
const PUBLIC_KEY3 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY3);
const ADDRESS3 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY3);

const PRIVATE_KEY4 = "f17f45faaceb506f27eb7fded347319220081cbbb053a7c34ebc6d21707442c6"
const PUBLIC_KEY4 = rc.utils.publicKeyFromPrivateKey(PRIVATE_KEY4);
const ADDRESS4 = rc.utils.revAddressFromPublicKey(PUBLIC_KEY4);

const main = async () => {
  await transferRev(PRIVATE_KEY1, ADDRESS1, ADDRESS2, 1000000000);
  await transferRev(PRIVATE_KEY1, ADDRESS1, ADDRESS3, 1000000000);
  await transferRev(PRIVATE_KEY1, ADDRESS1, ADDRESS4, 1000000000);
  console.log('✓ Initialized tests with 3 REV transfers')

  const result = await deployMultisig(PRIVATE_KEY1, [
    PUBLIC_KEY1,PUBLIC_KEY2,PUBLIC_KEY3,PUBLIC_KEY4
  ]);

  const multisigRegistryUri = result.registryUri.replace('rho:id:', '');

  await checkPublicKeys(multisigRegistryUri, { [PUBLIC_KEY1]: "initialized" })
  await checkPublicKeys(multisigRegistryUri, { [PUBLIC_KEY2]: "initialized" })
  await checkPublicKeys(multisigRegistryUri, { [PUBLIC_KEY3]: "initialized" })
  await checkPublicKeys(multisigRegistryUri, { [PUBLIC_KEY4]: "initialized" })

  console.log('✓ Checked all initialized public keys')

  await getKey(multisigRegistryUri, PRIVATE_KEY1, PUBLIC_KEY1)
  await checkPublicKeys(multisigRegistryUri, { [PUBLIC_KEY1]: "registered" })
  console.log('✓ First public key got its OCAP key')

  await getKey(multisigRegistryUri, PRIVATE_KEY2, PUBLIC_KEY2)
  await getKey(multisigRegistryUri, PRIVATE_KEY3, PUBLIC_KEY3)
  await getKey(multisigRegistryUri, PRIVATE_KEY4, PUBLIC_KEY4)
  await checkPublicKeys(multisigRegistryUri, {
    [PUBLIC_KEY1]: "registered",
    [PUBLIC_KEY2]: "registered",
    [PUBLIC_KEY3]: "registered",
  })
  console.log('✓ All 4 public keys got their OCAP keys')
  
  const multisigRevAddress = await getRevAddress(multisigRegistryUri);

  await transferRev(PRIVATE_KEY1, ADDRESS1, multisigRevAddress, 1500);
  await transferRev(PRIVATE_KEY2, ADDRESS2, multisigRevAddress, 1500);
  console.log('✓ Two REV transfers')

  const OPERATIONS1 = [
    { "type": "TRANSFER_REV", "amount": 1000, "recipient": "" },
    { "type": "TRANSFER_REV", "amount": 9999, "recipient": "1111Wbd8KLeWBVsxByF9iksJ4QRRjEF3nq1ScgAw7bMbtomxHsqqd" },
    { "type": "TRANSFER_REV", "amount": 1000, "recipient": "1111Wbd8KLeWBVsxByF9iksJ4QRRjEF3nq1ScgAw7bMbtomxHsqqd" },
    { "type": "TRANSFER_REV", "amount": 1, "recipient": "1111Wbd8KLeWBVsxByF9iksJ4QRRjEF3nq1ScgAw7bMbtomxHsqqd" }
  ];
  const OPERATIONS2 = [{ "type": "TRANSFER_REV", "amount": 2000, "recipient": "1111Wbd8KLeWBVsxByF9iksJ4QRRjEF3nq1ScgAw7bMbtomxHsqqd" }];

  await checkMultisigBalance(multisigRegistryUri, 3000);
  console.log('✓ Checked balances')

  // 25%
  const proposal1 = await proposeOperations(multisigRegistryUri, PRIVATE_KEY1, OPERATIONS1);
  console.log(proposal1)
  if (proposal1.message !== "operations recorded, did not execute") {
    throw new Error('proposal 1, expected "operations recorded, did not execute"')
  }
  console.log('✓ Proposal 1')

  await checkMultisigBalance(multisigRegistryUri, 3000);

  // 50%
  const proposal2 = await proposeOperations(multisigRegistryUri, PRIVATE_KEY2, OPERATIONS1);
  console.log(proposal2)
  if (proposal2.message !== "operations recorded, did not execute") {
    throw new Error('proposal 2, expected "operations recorded, did not execute"')
  }
  console.log('✓ Proposal 2')

  await checkMultisigBalance(multisigRegistryUri, 3000);

  // 25%
  const proposal3 = await proposeOperations(multisigRegistryUri, PRIVATE_KEY3, OPERATIONS2);
  console.log(proposal3)
  if (proposal3.message !== "operations recorded, did not execute") {
    throw new Error('proposal 3, expected "operations recorded, did not execute"')
  }
  console.log('✓ Proposal 3')

  await checkMultisigBalance(multisigRegistryUri, 3000);

  // 75%
  const proposal4 = await proposeOperations(multisigRegistryUri, PRIVATE_KEY4, OPERATIONS1);
  if (proposal4.message !== "operations recorded, did execute") {
    throw new Error('proposal 4, expected "operations recorded, did execute"')
  }
  console.log('✓ Proposal 4')

  await checkMultisigBalance(multisigRegistryUri, 3000 - 1001);

  await checkLastOperations(multisigRegistryUri, {
    "0": "Invalid address length",
    "1": "Insufficient funds",
    "2": "success",
    "3": "success",
  })

  // 25%
  const proposalAgain = await proposeOperations(multisigRegistryUri, PRIVATE_KEY4, OPERATIONS1);
  if (proposalAgain.message !== "operations recorded, did not execute") {
    throw new Error('proposal (agains), expected "operations recorded, did not execute"')
  }
  await checkMultisigBalance(multisigRegistryUri, 3000 - 1001);
  await checkLastOperations(multisigRegistryUri, {
    "0": "Invalid address length",
    "1": "Insufficient funds",
    "2": "success",
    "3": "success",
  })
  console.log('✓ Proposed again with no execution');
}

main();
