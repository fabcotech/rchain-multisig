/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.proposeOperationsChannelTerm = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
  newExecuteCh,
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {
  for (@(operationId, op, self, acceptCh, RevVault, return) <= newExecuteCh) {

    stdout!(op) |

    match op.get("type") {
      "JOIN_MULTISIG" => {
        new ch1, ch2, ch3 in {
          // APPLY to the multisig
          registryLookup!(op.get("registryUri"), *ch1) |
          for (masterEntry <- ch1) {
            masterEntry!(("PUBLIC_APPLY", op.get("applicationId"), bundle+{*ch2}, bundle+{return})) |

            for (@key <- ch2) {
              for (@multisigMemberships <- @(self, "multisigMemberships")) {
                ch3!("\${newIndex}" %% { "newIndex": multisigMemberships.keys().size() + 1 }) |
                for (@newIndex <- ch3) {

                  // store the registry URI and member id
                  @(self, "multisigMemberships")!(
                    multisigMemberships.set(
                      newIndex,
                      (op.get("registryUri"), op.get("applicationId"))
                    )
                  ) |

                  // store the OCAP key
                  for (@multisigMembershipsKeys <- @(self, "multisigMembershipsKeys")) {
                    @(self, "multisigMembershipsKeys")!(
                      multisigMembershipsKeys.set(
                        newIndex,
                        key
                      )
                    )
                  }
                }
              }
            }
          }
        }
      }
      "MINT_MULTISIG" => {
        new ch1, ch2, ch3, ch4, ch5, ch6 in {
          registryLookup!(op.get("mintRegistryUri"), *ch1) |         
          for (mintCh <- ch1) {
            mintCh!(*ch2) |
            for (@result <- ch2) {

              // Instantly APPLY
              registryLookup!(result.get("registryUri"), *ch3) |
              for (masterEntry <- ch3) {
                masterEntry!(("PUBLIC_APPLY", op.get("applicationId"), bundle+{*ch4}, bundle+{*ch5})) |

                // application should be instantly accepted
                for (@key <- ch4) {
                  @return!((true, Nil)) |

                  for (@multisigMemberships <- @(self, "multisigMemberships")) {
                    ch6!("\${newIndex}" %% { "newIndex": multisigMemberships.keys().size() + 1 }) |
                    for (@newIndex <- ch6) {

                      // store the registry URI and member id
                      @(self, "multisigMemberships")!(
                        multisigMemberships.set(
                          newIndex,
                          (result.get("registryUri"), op.get("applicationId"))
                        )
                      ) |

                      // store the OCAP key
                      for (@multisigMembershipsKeys <- @(self, "multisigMembershipsKeys")) {
                        @(self, "multisigMembershipsKeys")!(
                          multisigMembershipsKeys.set(
                            newIndex,
                            key
                          )
                        )
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
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
                  @(self, "removeProposalIfExistsCh")!((op.get("memberId"), return))
                }
              }
            }
          } else {
            @return!("member not found")
          }
        }
      }
      _ => {
        stdout!("Error: operation not supported") |
        @return!((true, Nil))
      }
    }
  } |

  for (keyCh <<- @(*deployerId, "rchain-multisig", \`rho:id:${payload.multisigRegistryUri}\`, "${payload.memberId}")) {
    keyCh!(("PROPOSE_OPERATIONS", bundle+{*newExecuteCh}, bundle+{*returnCh})) |
    for (@results <- returnCh) {
      match results {
        String => {
          deployId!({ "status": "failed", "error": results })
        }
        (true, Nil) => {
          deployId!({ "status": "completed" })
        }
        (true, String) => {
          // OP_PROPOSE_OPERATIONS_CHANNEL_COMPLETED_BEGIN
          deployId!({ "status": "completed", "message": results.nth(1) })
          // OP_PROPOSE_OPERATIONS_CHANNEL_COMPLETED_END
        }
      }
    }
  }
}`;
};
