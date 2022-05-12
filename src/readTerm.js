/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.readTerm = (
  payload
) => {
  return `new basket,
  entryCh, 
  resultCh,
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.multisigRegistryUri}\`, *entryCh) |

  for (entry <= entryCh) {
    entry!(("PUBLIC_READ", *basket))
  }
}
`;
};
