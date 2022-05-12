/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.mintTerm = (
  payload
) => {
  return `new basket,
  mintEntryCh,
  returnCh,
  stdout(\`rho:io:stdout\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.mintMultisigRegistryUri}\`, *mintEntryCh) |

  for (mint <- mintEntryCh) {
    mint!(*returnCh) |
    for (@r <- returnCh) {
      // OP_MINT_COMPLETED_BEGIN
      basket!(r)
      // OP_MINT_COMPLETED_END
    }
  }
}
`;
};
