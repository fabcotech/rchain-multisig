/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.readLastExecutedOperationsTerm = (
  payload
) => {
  return `new basket,
  masterEntryCh, 
  resultCh,
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.multisigRegistryUri}\`, *masterEntryCh) |

  for (masterEntry <= masterEntryCh) {
    masterEntry!(("PUBLIC_READ_LAST_EXECUTED_OPERATIONS", *basket))
  }
}
`;
};
