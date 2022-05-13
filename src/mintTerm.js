/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.mintTerm = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
  mintEntryCh,
  returnCh,
  stdout(\`rho:io:stdout\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.mintMultisigRegistryUri}\`, *mintEntryCh) |

  for (mint <- mintEntryCh) {
    mint!(*returnCh) |
    for (@rmint <- returnCh) {
      // OP_MINT_COMPLETED_BEGIN
      deployId!(rmint)
      // OP_MINT_COMPLETED_END
    }
  }
}
`;
};
