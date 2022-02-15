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
  for (@(operationId, op, self, acceptCh, RevVault, revAuthKey, revAddress, return) <= newExecuteCh) {
    // 1
    // 2
    // 3
    stdout!(op) |
    match op.get("type") {
      "TRANSFER_REV" => {
        stdout!("TRANSFER_REV") |
        new ch1, ch2 in {
          @RevVault!("findOrCreate", revAddress, *ch1) |
          for (@a <- ch1) {
            stdout!("1") |
            match a {
              (true, multisigPurseVault) => {
                stdout!("2") |
                @multisigPurseVault!("transfer", op.get("recipient"), op.get("amount"), revAuthKey, return)
              }
              _ => {
                stdout!("3") |
                @return!("failed to get multisig vault")
              }
            }
          }
        }
      }
      "ACCEPT" => {
        stdout!("ACCEPT") |
        for (@applications <<- @(self, "applications")) {
        stdout!(applications.get(op.get("applicationId"))) |
          for (@members <<- @(self, "members")) {
            match (op.get("applicationId"), applications.get(op.get("applicationId"))) {
              (String, Nil) => {
                stdout!("not found") |
                @return!("application id not found")
              }
              (String, applicationCh) => {
                for (@applications <- @(self, "applications")) {
                  @(self, "applications")!(applications.delete(op.get("applicationId"))) |
                  @acceptCh!((op.get("applicationId"), applicationCh, return))
                }
              }
              _ => {
                stdout!("not found") |
                @return!("application id not found")
              }
            }
          }
        }
      }
      "APPLY" => {
        stdout!("APPLY not supported") |
        @return!((true, Nil))
      }
      "KICK" => {
        stdout!("KICK not supported") |
        @return!((true, Nil))
      }
      _ => {
        stdout!("not supported") |
        @return!((true, Nil))
      }
    }
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
