/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.mintTerm = (
  payload
) => {
  return `new basket,
  mintEntryCh,
  stdout(\`rho:io:stdout\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.mintMultisigRegistryUri}\`, *mintEntryCh) |

  for (mint <- mintEntryCh) {
    mint!(*basket)
  }
}
`;
};
