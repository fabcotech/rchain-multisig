/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.readOperationsTerm = (
  payload
) => {
  return `new basket,
  entryCh, 
  resultCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.multisigRegistryUri}\`, *entryCh) |

  for (entry <= entryCh) {
    entry!(("PUBLIC_READ_OPERATIONS", *basket)) 
  }
}
`;
};
