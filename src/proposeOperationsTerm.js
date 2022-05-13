/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.proposeOperationsTerm = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (keyCh <<- @(*deployerId, "rchain-multisig", \`rho:id:${payload.multisigRegistryUri}\`, "${payload.memberId}")) {
    keyCh!(("PROPOSE_OPERATIONS", ${JSON.stringify(payload.operations).replace(new RegExp(': null|:null', 'g'), ': Nil').replace(/"\$BQ/g, '`').replace(/\$BQ"/g, '`')}, bundle+{*returnCh})) |
    for (@results <- returnCh) {
      stdout!(results) |
      match results {
        String => {
          deployId!({ "status": "failed", "error": results })
        }
        (true, Nil) => {
          deployId!({ "status": "completed" })
        }
        (true, String) => {
          deployId!({ "status": "completed", "message": results.nth(1) })
        }
      }
    }
  }
}
`;
};
