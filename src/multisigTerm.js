/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.multisigTerm = (payload) => {
    return `new
  deployId(\`rho:rchain:deployId\`),
  mintCh,
  mintUriCh,
  validateStringCh,
  insertArbitrary(\`rho:registry:insertArbitrary\`),
  blake2b256(\`rho:crypto:blake2b256Hash\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`),
  blockData(\`rho:block:data\`)
in {

  for (@(str, ret) <= validateStringCh) {
    match (str, Set("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9")) {
      (String, valids) => {
        match (str.length() > 1, str.length() < 25) {
          (true, true) => {
            new tmpCh, itCh in {
              for (@i <= itCh) {
                if (i == str.length()) { @ret!(true) }
                else {
                  if (valids.contains(str.slice(i, i + 1)) == true) { itCh!(i + 1) }
                  else { @ret!(false) }
                }
              } |
              itCh!(0)
            }
          }
          _ => { @ret!(false) }
        }
      }
      _ => { @ret!(false) }
    }
  } |

  for (basket <= mintCh) {
    new
      entryCh,
      entryUriCh,

      getOperationIdCh,
      defaultExecuteChannelCh,
      executeChannelCh,
      acceptCh,
      emptyOperationsCh,
      checkAgreementCh,
      executeOperationsCh,

      self
    in {

      @(*self, "percentage")!(66) |

      // Pending applications, UnforgeableName is the channel
      // where the OCAP key is sent once application is accepted
      // { "apesmultisig": UnforgeableName<abcdef>}
      @(*self, "applications")!({}) |

      @(*self, "operations")!({}) |

      @(*self, "lastExecutedOperations")!({}) |

      // Set of the multisig's member ids 
      // Set("charles", "olga", "apesmultisig")
      @(*self, "members")!(Set()) |

      // Set of the member ids that have been kicked or left
      // Set("bob", "mike")
      @(*self, "membersKickedOut")!(Set()) |

      // Stores memberships in other multisigs (recursiveness)
      // { "1": (\`rho:id:abcdefgh\`, "bob") }
      @(*self, "multisigMemberships")!({}) |

      // Stores OCAP keys for each membership
      // { "1": UnforgeableName<abdbeg> }
      @(*self, "multisigMembershipsKeys")!({}) |

      for (_ <= defaultExecuteChannelCh) {
        stdout!("default execution channel, don't know how to execute operations")
      } |
      executeChannelCh!(*defaultExecuteChannelCh) |

      for (@("PUBLIC_READ_OPERATIONS", return) <= entryCh) {
        for (@proposals <<- @(*self, "operations")) {
          new itCh, opsCh in {
            opsCh!({}) |
            itCh!(proposals.keys()) |
            for (@tmpOps <= itCh) {
              match tmpOps {
                Set() => {
                  @return!({
                    "proposals": proposals,
                    "operations": {}
                  })
                }
                Set(last) => {
                  for (@ops <- opsCh) {
                    for (@o <<- @(*self, "operationsbyhash", last)) {
                      @return!({
                        "proposals": proposals,
                        "operations": ops.set(last, o)
                      })
                    }
                  }
                }
                Set(first...rest) => {
                  for (@ops <- opsCh) {
                    for (@o <<- @(*self, "operationsbyhash", first)) {
                      opsCh!(ops.set(first, o)) |
                      itCh!(rest)
                    }
                  }
                }
              }
            }
          }
        }
      } |

      for (@("PUBLIC_READ_LAST_EXECUTED_OPERATIONS", return) <= entryCh) {
        for (@leo <<- @(*self, "lastExecutedOperations")) {
          @return!(leo)
        }
      } |

      for (@("PUBLIC_READ", return) <= entryCh) {
        new ch1, ch2, ch3 in {
          for (@entryUri <<- entryUriCh) {
            for (@members <<- @(*self, "members")) {
              for (@applications <<- @(*self, "applications")) {
                for (@revAddress <<- @(*self, "revAddress")) {
                  for (@percentage <<- @(*self, "percentage")) {
                    for (@memberships <<- @(*self, "multisigMemberships")) {
                      registryLookup!(\`rho:rchain:revVault\`, *ch1) |
                      for (@(_, RevVault) <- ch1) {
                        @RevVault!("findOrCreate", revAddress, *ch2) |
                        for (@(true, revVault) <- ch2) {
                          @revVault!("balance", *ch3) |
                          for (@balance <- ch3) {
                            @return!({
                              "multisigRegistryUri": entryUri,
                              "revAddress": revAddress,
                              "revBalance": balance,
                              "members": members,
                              "applications": applications.keys(),
                              "version": "0.2.0",
                              "percentage": percentage,
                              "multisigMemberships": memberships,
                            })
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } |

      for (@("PUBLIC_APPLY", applicationId, applicationCh, return) <= entryCh) {
        new ch1 in {
          validateStringCh!((applicationId, *ch1)) |
          for (@valid <- ch1) {
            if (valid == true) {
              for (@members <<- @(*self, "members")) {
                match members.size() {
                  0 => {
                    stdout!("First application, will be automatically accepted") |
                    acceptCh!((applicationId, applicationCh, return))
                  }
                  Int => {
                    for (@kicked <<- @(*self, "membersKickedOut"); @members <<- @(*self, "members")) {
                      if (kicked.contains(applicationId) == false and members.contains(applicationId) == false) {
                        for (@applications <- @(*self, "applications")) {
                          match applications.get(applicationId) {
                            Nil => {
                              stdout!("Not first application, will be registered") |
                              @(*self, "applications")!(applications.set(applicationId, applicationCh)) |
                              @return!((true, "application registered"))
                            }
                            _ => {
                              @(*self, "applications")!(applications) |
                              @return!("error: application already exists")
                            }
                          }
                        }
                      } else {
                        @return!("member id not available")
                      }
                    }
                  }
                  _ => {
                    @return!("error: applicationId must be string")
                  }
                }
              }
            } else {
              @return!("error: applicationId must be string with characters a-z0-9 and length 1-25")
            }
          }
        }
      } |

      for (@(memberId, applicationCh, return) <= acceptCh) {
        for (@members <- @(*self, "members")) {
          @(*self, "members")!(members.union(Set(memberId))) |

          new keyCh, actionCh in {
            contract actionCh(@("LEAVE", payload, return2)) = {
              new ret in {
                for (@members <- @(*self, "members")) {
                  @(*self, "members")!(members.delete(memberId))
                } |
                @(*self, "removeProposalIfExistsCh")!((memberId, return2))
              }
            } |

            contract actionCh(@("PROPOSE_OPERATIONS", payload, return2)) = {
              match payload {
                Nil => {
                  @(*self, "removeProposalIfExistsCh")!((memberId, return2))
                }
                _ => {
                  new hashCh, ret in {
                    @(*self, "removeProposalIfExistsCh")!((memberId, *ret)) |
                    for (_ <- ret) {
                      blake2b256!(payload.toByteArray(), *hashCh) |
                      for (@hash <- hashCh) {
                        for (@ops <- @(*self, "operations")) {
                          if (ops.get(hash) == Nil) {
                            @(*self, "operationsbyhash", hash)!(payload) |
                            @(*self, "operations")!(
                              ops.set(
                                hash,
                                Set(memberId)
                              )
                            )
                          } else {
                            @(*self, "operations")!(
                              ops.set(
                                hash,
                                ops.get(hash).union(Set(memberId))
                              )
                            )
                          } |
                          checkAgreementCh!((payload, return2))
                        }
                      }
                    }
                  }
                }
              }
            } |

            for (@(action, payload, return2) <= keyCh) {
              for (@revoked <- @(*self, "revoked", memberId)) {
                match action {
                  "LEAVE" => {
                    actionCh!((action, payload, return2))
                  }
                  "PROPOSE_OPERATIONS" => {
                    @(*self, "revoked", memberId)!(Nil) |
                    actionCh!((action, payload, return2))
                  }
                  _ => {
                    @(*self, "revoked", memberId)!(Nil) |
                    @return2!("unknown action")
                  }
                }
              }
            } |

            @(*self, "revoked", memberId)!(Nil) |
            @applicationCh!(bundle+{*keyCh}) |
            @return!((true, "application accepted"))
          }
        }
      } |

      for (@(operations, return) <= checkAgreementCh) {
        new itCh in {
          for (@members <<- @(*self, "members")) {
            for (@ops <<- @(*self, "operations")) {
              for (@percentage <<- @(*self, "percentage")) {
                itCh!(ops.keys()) |
                for (@tmpOps <= itCh) {
                  match tmpOps {
                    Set(last) => {
                      if (ops.get(last).size() * 100 / members.size() >= percentage) {
                        for (@opsToExecute <- @(*self, "operationsbyhash", last)) {
                          executeOperationsCh!((opsToExecute, last)) |
                          @return!((true, "operations recorded, did execute"))
                        }
                      } else {
                        @return!((true, "operations recorded, did not execute"))
                      }
                    }
                    Set(first...rest) => {
                      if (ops.get(first).size() * 100 / members.size() >= percentage) {
                        for (@opsToExecute <- @(*self, "operationsbyhash", first)) {
                          stdout!(("hash", first, "let's execute", ops.get(first).size() * 100 / members.size())) |
                          executeOperationsCh!((opsToExecute, first)) |
                          @return!((true, "operations recorded, did execute"))
                        }
                      } else {
                        stdout!(("don't execute hash", first, "continue iteration")) |
                        itCh!(rest)
                      }
                    }
                  }
                }
              } 
            }
          }
        }
      } |

      for (@(memberId, ret) <= @(*self, "removeProposalIfExistsCh")) {
        new itCh in {
          for (@ops <- @(*self, "operations")) {
            itCh!(ops.keys()) |
            for (@tmpOps <= itCh) {
              match tmpOps {
                Set() => {
                  @(*self, "operations")!(ops) |
                  @ret!((true, Nil))
                }
                Set(last) => {
                  if (ops.get(last).contains(memberId)) {
                    if (ops.get(last).size() == 1) {
                      for (_ <- @(*self, "operationsbyhash", last)) { Nil } |
                      @(*self, "operations")!(ops.delete(last))
                    } else {
                      @(*self, "operations")!(
                        ops.set(
                          last,
                          ops.get(last).delete(memberId)
                        )
                      )
                    } |
                    @ret!((true, Nil))
                  } else {
                    @(*self, "operations")!(ops) |
                    @ret!((true, Nil))
                  }                  
                }
                Set(first...rest) => {
                  if (ops.get(first).contains(memberId)) {
                    if (ops.get(first).size() == 1) {
                      for (_ <- @(*self, "operationsbyhash", first)) { Nil } |
                      @(*self, "operations")!(ops.delete(first))
                    } else {
                      @(*self, "operations")!(
                        ops.set(
                          first,
                          ops.get(first).delete(memberId)
                        )
                      )
                    } |
                    @ret!((true, Nil))
                  } else {
                    itCh!(rest)
                  }
                }
              }
            }
          }
        }
      } |

      for (@hash <= emptyOperationsCh) {
        for (_ <- @(*self, "operationsbyhash", hash)) {
          Nil
        } |
        for (@ops <- @(*self, "operations")) {
          @(*self, "operations")!(ops.delete(hash))
        }
      } |

      for (@(operations, hash) <= executeOperationsCh) {
        for (_ <- @(*self, "lastExecutedOperations")) {
          @(*self, "lastExecutedOperations")!({}) |
          match operations {
            [] => {
              stdout!("error: no operations")
            }
            [...rest] => {
              new itCh, ch1 in {
                registryLookup!(\`rho:rchain:revVault\`, *ch1) |
                for (@revAuthKey <<- @(*self, "revAuthKey")) {
                  for (@revAddress <<- @(*self, "revAddress")) {
                    for (@(_, RevVault) <- ch1) {
                      itCh!((rest, 0)) |
                      for (@(tmpOperations, index) <= itCh) {
                        match tmpOperations {
                          [] => {
                            stdout!("error: no operations")
                          }
                          [last] => {
                            new ret in {
                              for (ch <<- executeChannelCh) {
                                ch!((index, last, *self, *acceptCh, RevVault, *ret)) |
                                for (@result <- ret) {
                                  for (@leo <- @(*self, "lastExecutedOperations")) {
                                    @(*self, "lastExecutedOperations")!(leo.set("\${index}" %% { "index": index }, result)) |
                                    emptyOperationsCh!(hash)
                                  }
                                }
                              }
                            }
                          }
                          [first ... rest2] => {
                            new ret in {
                              for (ch <<- executeChannelCh) {
                                ch!((index, first, *self, *acceptCh, RevVault, *ret)) |
                                for (@result <- ret) {
                                  for (@leo <- @(*self, "lastExecutedOperations")) {
                                    @(*self, "lastExecutedOperations")!(leo.set("\${index}" %% { "index": index }, result)) |
                                    itCh!((rest2, index + 1))
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            // operations is a new execute channel
            _ => {
              for (_ <- executeChannelCh) {
                executeChannelCh!(operations) |
                for (_ <- @(*self, "lastExecutedOperations")) {
                  @(*self, "lastExecutedOperations")!({ "0": (true, "execute channel updated")}) |
                  emptyOperationsCh!(hash)
                }
              }
            }
          }
        }
      } |

      insertArbitrary!(bundle+{*entryCh}, *entryUriCh) |

      new unf, ch1, ch2, ch4 in {
        for (entryUri <<- entryUriCh) {
          registryLookup!(\`rho:rchain:revVault\`, *ch4) |

          for (@(_, RevVault) <- ch4) {
            @RevVault!("unforgeableAuthKey", *unf, *ch1) |
            revAddress!("fromUnforgeable", *unf, *ch2)
          } |

          for (@revAuthKey <- ch1; @revAddress <- ch2) {
            @(*self, "revAuthKey")!(revAuthKey) |
            @(*self, "revAddress")!(revAddress) |
            basket!({
              "status": "completed",
              "registryUri": *entryUri
            }) |
            stdout!(("multisig registered at", *entryUri))
          }
        }
      }
    }
  } |

  insertArbitrary!(bundle+{*mintCh}, *mintUriCh) |
  for (mintUri <- mintUriCh) {
    stdout!(("multisig mint registered at", *mintUri)) |
    deployId!({
      "status": "completed",
      "registryUri": *mintUri
    })
  }
}`;
};
