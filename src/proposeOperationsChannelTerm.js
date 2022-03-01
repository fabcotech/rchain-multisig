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
  for (@(operationId, op, self, acceptCh, RevVault, return) <= newExecuteCh) {
    // 1
    // 2
    // 3
    stdout!(op) |
    match op.get("type") {
      "TRANSFER_REV" => {
        new ch1, ch2 in {
          for (@revAddress <<- @(self, "revAddress")) {
            @RevVault!("findOrCreate", revAddress, *ch1) |
            for (@a <- ch1) {
              match a {
                (true, multisigPurseVault) => {
                  for (@revAuthKey <<- @(self, "revAuthKey")) {
                    @multisigPurseVault!("transfer", op.get("recipient"), op.get("amount"), revAuthKey, return)
                  }
                }
                _ => {
                  @return!("failed to get multisig vault")
                }
              }
            }
          }
        }
      }
      "ACCEPT" => {
        for (@applications <<- @(self, "applications")) {
          for (@members <<- @(self, "members")) {
            match (op.get("applicationId"), applications.get(op.get("applicationId"))) {
              (String, Nil) => {
                @return!("application id not found")
              }
              (String, applicationCh) => {
                for (@applications <- @(self, "applications")) {
                  @(self, "applications")!(applications.delete(op.get("applicationId"))) |
                  @acceptCh!((op.get("applicationId"), applicationCh, return))
                }
              }
              _ => {
                @return!("application id not found")
              }
            }
          }
        }
      }
      "KICKOUT" => {
        for (@members <<- @(self, "members")) {
          if (members.contains(op.get("memberId"))) {
            for (_ <- @(self, "revoked", op.get("memberId"))) {
              for (@members <- @(self, "members")) {
                @(self, "members")!(members.delete(op.get("memberId"))) |
                for (@kicked <- @(self, "membersKickedOut")) {
                  @(self, "membersKickedOut")!(kicked.union(Set(op.get("memberId")))) |
                  for (_ <- @(self, "operations", op.get("memberId"))) { Nil } |
                  @return!((true, Nil))
                }
              }
            }
          } else {
            @return!("member not found")
          }
        }
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
