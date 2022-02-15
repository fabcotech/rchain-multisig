/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.multisigTerm = (payload) => {
    return `new
  basket,

  entryCh,
  entryUriCh,

  getOperationIdCh,
  validateStringCh,
  defaultExecuteChannelCh,
  executeChannelCh,
  acceptCh,
  emptyOperationsCh,
  checkAgreementCh,
  executeOperationsCh,

  self,

  insertArbitrary(\`rho:registry:insertArbitrary\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`),
  blockData(\`rho:block:data\`)
in {

  @(*self, "applications")!({}) |
  @(*self, "percentage")!(66) |
  @(*self, "lastExecutedOperations")!({}) |
  @(*self, "members")!(Set()) |
  @(*self, "membersKickedOut")!(Set()) |

  for (_ <= defaultExecuteChannelCh) {
    stdout!("don't know how to execute")
  } |
  executeChannelCh!(*defaultExecuteChannelCh) |

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

  for (@("PUBLIC_READ_OPERATIONS", memberId, return) <= entryCh) {
    for (@op <<- @(*self, "operations", memberId)) {
      @return!(op)
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
                        "version": "0.1.0",
                        "percentage": percentage,
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
      new keyCh in {
        for (@("PROPOSE_OPERATIONS", operations, return2) <= keyCh) {
          for (@members <<- @(*self, "members")) {
            if (members.contains(memberId)) {
              match operations {
                Nil => {
                  for (_ <- @(*self, "operations", memberId)) {
                    @(*self, "operations", memberId)!(Nil) |
                    @return2!((true, Nil))
                  }
                }
                _ => {
                  for (_ <- @(*self, "operations", memberId)) {
                    @(*self, "operations", memberId)!(operations) |
                    checkAgreementCh!((operations, return2))
                  }
                }
              }
            } else {
              stdout!("you have been kicked") |
              @return2!("member id not found")
            }
          }
        } |

        @(*self, "operations", memberId)!(Nil) |
        @applicationCh!(bundle+{*keyCh}) |
        @return!((true, "application accepted"))
      }
    }
  } |

  for (@(operations, return) <= checkAgreementCh) {
    stdout!("checkAgreementCh") |
    new itCh, howManyCh in {
      howManyCh!(Set()) |
      for (@members <<- @(*self, "members")) {
        for (@percentage <<- @(*self, "percentage")) {
          itCh!(members) |
          for (@tmpMembers <= itCh) {
            match tmpMembers {
              Set(last) => {
                for (@op <<- @(*self, "operations", last)) {
                  stdout!(operations.toByteArray()) |
                  stdout!(op.toByteArray()) |
                  match operations.toByteArray() == op.toByteArray() {
                    true => {
                      for (@howMany <- howManyCh) {
                      stdout!((true, howMany.size())) |
                        match howMany.size() + 1 {
                          howMany2 => {
                            match howMany2 * 100 / members.size() >= percentage {
                              true => {
                                executeOperationsCh!((operations, howMany.union(Set(last)))) |
                                @return!((true, "operations recorded, did execute"))
                              }
                              false => {
                                @return!((true, "operations recorded, did not execute"))
                              }
                            }
                          }
                        }
                      }
                    }
                    false => {
                      for (@howMany <- howManyCh) {
                      stdout!((false, howMany.size())) |
                        // howMany
                        // members
                        match howMany.size() * 100 / members.size() >= percentage {
                          true => {
                            executeOperationsCh!((operations, howMany, return))
                          }
                          false => {
                            @return!((true, "operations recorded, did not execute"))
                          }
                        }
                      }
                    }
                  }
                }
              }
              Set(first...rest) => {
                for (@op <<- @(*self, "operations", first)) {
                  match operations.toByteArray() == op.toByteArray() {
                    true => {
                      for (@howMany <- howManyCh) {
                        howManyCh!(howMany.union(Set(first))) |
                        itCh!(rest)
                      }
                    }
                    false => {
                      itCh!(rest)
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

  for (@memberIds <= emptyOperationsCh) {
    new itCh in {
      itCh!(memberIds) |
      for (@ids <= itCh) {
        stdout!(("ids", ids)) |
        match ids {
          Set() => {}
          Set(last) => {
            for (_ <- @(*self, "operations", last)) {
              @(*self, "operations", last)!(Nil)
            }
          }
          Set(first...rest) => {
            for (_ <- @(*self, "operations", first)) {
              @(*self, "operations", first)!(Nil) |
              itCh!(rest)
            }
          }
        }
      }
    }
  } |

  for (@(operations, memberIds) <= executeOperationsCh) {
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
                                emptyOperationsCh!(memberIds)
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
              emptyOperationsCh!(memberIds)
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
        stdout!(("rchain-token multisig registered at", *entryUri))
      }
    }
  }
}
`;
};
