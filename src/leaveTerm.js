/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.leaveTerm = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (keyCh <<- @(*deployerId, "rchain-multisig", \`rho:id:${payload.multisigRegistryUri}\`, "${payload.memberId}")) {
    keyCh!(("LEAVE", Nil, bundle+{*returnCh})) |
    for (@results <- returnCh) {
      stdout!(results) |
      match results {
        String => {
          deployId!({ "status": "failed", "error": results })
        }
        (true, Nil) => {
          deployId!({ "status": "completed" })
        }
      }
    }
  }
}
`;
};
