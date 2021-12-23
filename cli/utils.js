const fs = require('fs');

const log = (a, level = 'info') => {
  if (level === 'warning') {
    console.log('\x1b[33m%s\x1b[0m', new Date().toISOString() + ' [WARN] ' + a);
  } else if (level === 'error') {
    console.log(
      '\x1b[31m%s\x1b[0m',
      new Date().toISOString() + ' [ERROR] ' + a
    );
  } else {
    console.log(new Date().toISOString(), a);
  }
};
module.exports.log = log;

const getProcessArgv = (param) => {
  const index = process.argv.findIndex((arg) => arg === param);
  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
};
module.exports.getProcessArgv = getProcessArgv;

module.exports.getMemberId = () => {
  const memberId = getProcessArgv('--member-id');
  if (!memberId) {
    throw new Error('Missing arguments --member-id');
  }
  return memberId;
};

module.exports.getApplicationId = () => {
  const aid = getProcessArgv('--application-id');
  if (!aid) {
    throw new Error('Missing arguments --application-id');
  }
  return aid;
};

module.exports.getOperationsFile = () => {
  const path = getProcessArgv('--operations');
  if (typeof path !== 'string' || !fs.existsSync(path)) {
    throw new Error('Missing arguments --operations, or operations does not exist');
  }
  const data = fs.readFileSync(path, 'utf8');
  return data;
};


module.exports.getMultisigRegistryUri = () => {
  let registryUri = getProcessArgv('--multisig-registry-uri');
  if (!registryUri) {
    registryUri = getProcessArgv('-r');
  }
  if (typeof registryUri !== 'string') {
    registryUri = process.env.MULTISIG_REGISTRY_URI;
  }
  if (typeof registryUri !== 'string' || registryUri.length === 0) {
    throw new Error(
      'Missing arguments --multisig-registry-uri, or -r, or MULTISIG_REGISTRY_URI=* in .env file'
    );
  }
  return registryUri;
};
