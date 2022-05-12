/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.proposeOperationsTerm = (
  payload
) => {
  return `new basket,
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (keyCh <<- @(*deployerId, "rchain-multisig", "${payload.multisigRegistryUri}", "${payload.memberId}")) {
    keyCh!(("PROPOSE_OPERATIONS", ${JSON.stringify(payload.operations).replace(new RegExp(': null|:null', 'g'), ': Nil').replace(/"\$BQ/g, '`').replace(/\$BQ"/g, '`')}, bundle+{*returnCh})) |
    for (@results <- returnCh) {
      stdout!(results) |
      match results {
        String => {
          basket!({ "status": "failed", "error": results })
        }
        (true, Nil) => {
          basket!({ "status": "completed" })
        }
        (true, String) => {
          basket!({ "status": "completed", "message": results.nth(1) })
        }
      }
    }
  }
}
`;
};
