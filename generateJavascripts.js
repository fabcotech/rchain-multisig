const fs = require('fs');
const { VERSION } = require('./constants');

const replaceEverything = (a) => {
  return (
    a
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${')
      .replace(/\\\//g, '\\\\/')
      .replace(/PUBLIC_KEY/g, '${payload.publicKey}')
      .replace(/APPLICATION_ID/g, '${payload.applicationId}')
      .replace(/MEMBER_ID/g, '${payload.memberId}')
      .replace(/SIGNATURE/g, '${payload.signature}')
      .replace(/MINT_MULTISIG_REGISTRY_URI/g, '${payload.mintMultisigRegistryUri}')
      .replace(/MULTISIG_REGISTRY_URI/g, '${payload.multisigRegistryUri}')
      .replace(
        'OPERATIONSS',
        `\${JSON.stringify(payload.operations).replace(new RegExp(': null|:null', 'g'), ': Nil').replace(/"\\\$BQ/g, '\`').replace(/\\\$BQ"/g, '\`')}`
      )
  );
};


const multisigTerm = fs.readFileSync('./rholang/multisig.rho').toString('utf8');

fs.writeFileSync(
  './src/multisigTerm.js',
  `/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.multisigTerm = (payload) => {
    return \`${multisigTerm
      .replace(/`/g, '\\`')
      .replace(/\\\//g, '\\\\/')
      .replace(/\$\{/g, '\\${')
      .replace(/VERSION/g, `${VERSION}`)
      .replace(/PUBLIC_KEYS/g, 'Set(${payload.publicKeys.map(pk => \'"\' + pk + \'"\').join(",")})')
      .replace(/DEPTH_CONTRACT/g, '${payload.contractDepth || 2}')
      .replace(/DEPTH/g, '${payload.depth || 3}')}\`;
};
`
);

const mintFile = fs
  .readFileSync('./rholang/op_mint.rho')
  .toString('utf8');
fs.writeFileSync(
  './src/mintTerm.js',
  `/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.mintTerm = (
  payload
) => {
  return \`${replaceEverything(mintFile)}\`;
};
`
);

const applyFile = fs
  .readFileSync('./rholang/op_apply.rho')
  .toString('utf8');
fs.writeFileSync(
  './src/applyTerm.js',
  `/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.applyTerm = (
  payload
) => {
  return \`${replaceEverything(applyFile)}\`;
};
`
);

const leaveFile = fs
  .readFileSync('./rholang/op_leave.rho')
  .toString('utf8');
fs.writeFileSync(
  './src/leaveTerm.js',
  `/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.leaveTerm = (
  payload
) => {
  return \`${replaceEverything(leaveFile)}\`;
};
`
);

const proposeOperationsFile = fs
  .readFileSync('./rholang/op_propose_operations.rho')
  .toString('utf8');
fs.writeFileSync(
  './src/proposeOperationsTerm.js',
  `/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.proposeOperationsTerm = (
  payload
) => {
  return \`${replaceEverything(proposeOperationsFile)}\`;
};
`
);

const proposeOperationsChannelFile = fs
  .readFileSync('./rholang/op_propose_operations_channel.rho')
  .toString('utf8');
fs.writeFileSync(
  './src/proposeOperationsChannelTerm.js',
  `/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.proposeOperationsChannelTerm = (
  payload
) => {
  return \`${replaceEverything(proposeOperationsChannelFile)}\`;
};
`
);

const readFile = fs
  .readFileSync('./rholang/read.rho')
  .toString('utf8');
fs.writeFileSync(
  './src/readTerm.js',
  `/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.readTerm = (
  payload
) => {
  return \`${replaceEverything(readFile)}\`;
};
`
);

const readLastExecutedOperationsFile = fs
  .readFileSync('./rholang/read_last_executed_operations.rho')
  .toString('utf8');
fs.writeFileSync(
  './src/readLastExecutedOperationsTerm.js',
  `/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.readLastExecutedOperationsTerm = (
  payload
) => {
  return \`${replaceEverything(readLastExecutedOperationsFile)}\`;
};
`
);

const readOperationsFile = fs
  .readFileSync('./rholang/read_operations.rho')
  .toString('utf8');
fs.writeFileSync(
  './src/readOperationsTerm.js',
  `/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.readOperationsTerm = (
  payload
) => {
  return \`${replaceEverything(readOperationsFile)}\`;
};
`
);