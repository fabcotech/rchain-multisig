/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.readOperationsTerm = (
  payload
) => {
  return `new basket,
  masterEntryCh, 
  resultCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.multisigRegistryUri}\`, *masterEntryCh) |

  for (masterEntry <= masterEntryCh) {
    masterEntry!(("PUBLIC_READ_OPERATIONS", "${payload.publicKey}", *basket)) 
  }
}
`;
};
