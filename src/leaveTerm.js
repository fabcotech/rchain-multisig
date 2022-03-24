/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.leaveTerm = (
  payload
) => {
  return `new basket,
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (keyCh <<- @(*deployerId, "rchain-multisig", "${payload.multisigRegistryUri}")) {
    keyCh!(("LEAVE", Nil, bundle+{*returnCh})) |
    for (@results <- returnCh) {
      stdout!(results) |
      match results {
        String => {
          basket!({ "status": "failed", "error": results })
        }
        (true, Nil) => {
          basket!({ "status": "completed" })
        }
      }
    }
  }
}
`;
};