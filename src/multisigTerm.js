/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.multisigTerm = (payload) => {
    return `new 
  basket,

  entryCh,
  entryUriCh,

  getOperationIdCh,
  validateStringCh,

  applicationsCh,
  acceptCh,
  checkOperationsCh,
  checkAgreementCh,
  executeOperationsCh,
  executeOp1Ch,
  executeOp2Ch,

  self,

  insertArbitrary(\`rho:registry:insertArbitrary\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`),
  blockData(\`rho:block:data\`)
in {

  applicationsCh!({}) |
  @(*self, "percentage")!(66) |
  @(*self, "lastExecutedOperations")!({}) |
  @(*self, "members")!(Set()) |

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
          for (@applications <<- applicationsCh) {
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
                for (@applications <- applicationsCh) {
                  match applications.get(applicationId) {
                    Nil => {
                      stdout!("Not first application, will be registered") |
                      applicationsCh!(applications.set(applicationId, applicationCh)) |
                      @return!((true, "application registered"))
                    }
                    _ => {
                      applicationsCh!(applications) |
                      @return!("error: application already exists")
                    }
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
          match operations {
            List => {
              checkOperationsCh!((operations, memberId, return2))
            }
            Nil => {
              for (_ <- @(*self, "operations", memberId)) {
                @(*self, "operations", memberId)!(Nil) |
                @return2!((true, Nil))
              }
            }
            _ => {
              @return2!("error: operations is not a List")
            }
          }
        } |

        @(*self, "operations", memberId)!(Nil) |
        @applicationCh!(bundle+{*keyCh}) |
        @return!((true, "application accepted"))
      }
    }
  } |

  for (@(op, return) <= getOperationIdCh) {
    match op {
      { "type": "TRANSFER_REV", "amount": Int, "recipient": String } => {
        @return!(1)
      }
      { "type": "ACCEPT", "applicationId": String } => {
        @return!(2)
      }
      _ => {
        @return!(Nil)
      }
    }
  } |

  for (@(operations, memberId, return) <= checkOperationsCh) {
    new itCh, ch1 in {
      itCh!(operations) |
      for (@tmpOperations <= itCh) {
        match tmpOperations {
          [] => {
            stdout!("error: no operations") |
            @return!("error: no operations")
          }
          [last] => {
            getOperationIdCh!((last, *ch1)) |
            for (@operationId <- ch1) {
              if (operationId == Nil) {
                @return!("error: operation is invalid")
              } else {
                for (_ <- @(*self, "operations", memberId)) {
                  @(*self, "operations", memberId)!(operations) |
                  checkAgreementCh!((operations, return))
                }
              }
            }
          }
          [first ... rest] => {
            getOperationIdCh!((first, *ch1)) |
            for (@operationId <- ch1) {
              if (operationId == Nil) {
                @return!("error: operation is invalid")
              } else {
                itCh!(rest)
              }
            }
          }
        }
      }
    }
  } |

  for (@(operations, return) <= checkAgreementCh) {
    new itCh, howManyCh in {
      howManyCh!(Set()) |
      for (@members <<- @(*self, "members")) {
        for (@percentage <<- @(*self, "percentage")) {
          itCh!(members) |
          for (@tmpMembers <= itCh) {
            match tmpMembers {
              Set(last) => {
                for (@op <<- @(*self, "operations", last)) {
                  match operations.toByteArray() == op.toByteArray() {
                    true => {
                      for (@howMany <- howManyCh) {
                        match howMany.size() + 1 {
                          howMany2 => {
                            match howMany2 * 100 / members.size() >= percentage {
                              true => {
                                executeOperationsCh!((operations, howMany.union(Set(last)), return))
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

  // ===== OPERATION 1
  // REV transfer
  // =================
  for (@(op, index, RevVault, return) <= executeOp1Ch) {
    new ch1, ch2, ch3 in {
      for (@revAddress <<- @(*self, "revAddress")) {
        for (@revAuthKey <<- @(*self, "revAuthKey")) {
          @RevVault!("findOrCreate", revAddress, *ch1) |
          for (@a <- ch1) {
            match a {
              (true, multisigPurseVault) => {
                @multisigPurseVault!("transfer", op.get("recipient"), op.get("amount"), revAuthKey, *ch2) |
                for (@transferResult <- ch2) {
                  match transferResult {
                    (true, Nil) => {
                      for (@leo <- @(*self, "lastExecutedOperations")) {
                        @(*self, "lastExecutedOperations")!(leo.set("\${index}" %% { "index": index }, "success"))
                      } |
                      @return!(Nil)
                    }
                    (false, message) => {
                      for (@leo <- @(*self, "lastExecutedOperations")) {
                        @(*self, "lastExecutedOperations")!(leo.set("\${index}" %% { "index": index }, message))
                      } |
                      @return!(Nil)
                    }
                  }
                }
              }
              _ => {
                for (@leo <- @(*self, "lastExecutedOperations")) {
                  @(*self, "lastExecutedOperations")!(leo.set("\${index}" %% { "index": index }, "error CRITICAL: invalid rev address"))
                } |
                @return!(Nil)
              }
            }
          }
        }
      }
    }
  } |

  // ===== OPERATION 2
  // Accept application
  // =================
  for (@(op, index, return) <= executeOp2Ch) {
    for (@applications <- applicationsCh) {
      match applications.get(op.get("applicationId")) {
        Nil => {
          applicationsCh!(applications) |
          for (@leo <- @(*self, "lastExecutedOperations")) {
            @(*self, "lastExecutedOperations")!(leo.set("\${index}" %% { "index": index }, "application id not found"))
          } |
          @return!(Nil)
        }
        applicationCh => {
          applicationsCh!(applications.delete(op.get("applicationId"))) |
          for (@leo <- @(*self, "lastExecutedOperations")) {
            @(*self, "lastExecutedOperations")!(leo.set("\${index}" %% { "index": index }, "application accepted"))
          } |
          acceptCh!((op.get("applicationId"), applicationCh, return))
        }
      }
    }
  } |

  for (@(operations, memberIds, return) <= executeOperationsCh) {
    new overCh, overItCh, itCh, indexCh, ch1, ch2, ch3 in {
      for (@v <- overCh) {
        @return!(v) |
        overItCh!(memberIds) |
        for (@tmpIds <= overItCh) {
          match tmpIds {
            Set(last) => {
              for (_ <- @(*self, "operations", last)) {
                @(*self, "operations", last)!(Nil)
              }
            }
            Set(first...rest) => {
              for (_ <- @(*self, "operations", first)) {
                @(*self, "operations", first)!(Nil)
              } |
              overItCh!(rest)
            }
          }
        }
      } |

      registryLookup!(\`rho:rchain:revVault\`, *ch1) |
      itCh!(operations) |
      indexCh!(0) |
      for (_ <- @(*self, "lastExecutedOperations")) {
        @(*self, "lastExecutedOperations")!({}) |
        for (@(_, RevVault) <- ch1) {
          for (@tmpOperations <= itCh) {
            match tmpOperations {
              [] => {
                stdout!("error CRITICAL: no operations") |
                @return!("error CRITICAL: no operations")
              }
              [last] => {
                for (@index <- indexCh) {
                  getOperationIdCh!((last, *ch3)) |
                  for (@operationId <- ch3) {
                    match operationId {
                      1 => {
                        executeOp1Ch!((last, index, RevVault, *ch2)) |
                        for (_ <- ch2) {
                          overCh!((true, "operations recorded, did execute"))
                        }
                      }
                      2 => {
                        executeOp2Ch!((last, index, *ch2)) |
                        for (_ <- ch2) {
                          overCh!((true, "operations recorded, did execute"))
                        }
                      }
                    }
                  }
                }
              }
              [first...rest] => {
                for (@index <- indexCh) {
                  indexCh!(index + 1) |
                  getOperationIdCh!((first, *ch3)) |
                  for (@operationId <- ch3) {
                    match operationId {
                      1 => {
                        executeOp1Ch!((first, index, RevVault, *ch2)) |
                        for (_ <- ch2) { itCh!(rest) }
                      }
                      2 => {
                        executeOp2Ch!((first, index, *ch2)) |
                        for (_ <- ch2) { itCh!(rest) }
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
