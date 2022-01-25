/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.proposeOperationsChannelTerm = (
  payload
) => {
  return `new basket,
  newExecuteCh,
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {
  for (@(operationId, op, RevVault, revAuthKey, revAddress, members, return) <= newExecuteCh) {
    stdout!("new execute channel") |
    stdout!(("revAuthKey", revAuthKey)) |
    stdout!(("revAddress", revAddress)) |
    stdout!(("RevVault", RevVault)) |
    @return!((true, Nil))
  } |

  for (keyCh <<- @(*deployerId, "rchain-multisig", "${payload.multisigRegistryUri}")) {
    keyCh!(("PROPOSE_OPERATIONS", bundle+{*newExecuteCh}, bundle+{*returnCh})) |
    for (@results <- returnCh) {
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
}`;
};
