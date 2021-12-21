const fs = require('fs');
const { VERSION } = require('./constants');

const replaceEverything = (a) => {
  return (
    a
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${')
      .replace(/\\\//g, '\\\\/')
      .replace(/PUBLIC_KEY/g, '${payload.publicKey}')
      .replace(/SIGNATURE/g, '${payload.signature}')
      .replace(/MULTISIG_REGISTRY_URI/g, '${payload.multisigRegistryUri}')
      .replace(
        'OPERATIONSS',
        `\${JSON.stringify(payload.operations).replace(new RegExp(': null|:null', 'g'), ': Nil')}`
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

const getKeyFile = fs
  .readFileSync('./rholang/op_get_key.rho')
  .toString('utf8');
fs.writeFileSync(
  './src/getKeyTerm.js',
  `/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.getKeyTerm = (
  payload
) => {
  return \`${replaceEverything(getKeyFile)}\`;
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