/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.multisigTerm = (payload) => {
    return `new 
  basket,

  entryCh,
  entryUriCh,

  checkOperationsCh,
  checkAgreementCh,
  executeOperationsCh,

  vault,

  insertArbitrary(\`rho:registry:insertArbitrary\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`),
  registryLookup(\`rho:registry:lookup\`),
  blockData(\`rho:block:data\`),
  secpVerify(\`rho:crypto:secp256k1Verify\`),
  blake2b256(\`rho:crypto:blake2b256Hash\`)
in {

  @(*vault, "percentage")!(66) |
  @(*vault, "lastExecutedOperations")!(Nil) |
    @(*vault, "publicKeys")!({}) |

  for (@("PUBLIC_READ_LAST_EXECUTED_OPERATIONS", return) <= entryCh) {
    for (@leo <<- @(*vault, "lastExecutedOperations")) {
      @return!(leo)
    }
  } |

  for (@("PUBLIC_READ", return) <= entryCh) {
    new ch1, ch2, ch3 in {
      for (@entryUri <<- entryUriCh) {
        for (@publicKeys <<- @(*vault, "publicKeys")) {
          for (@revAddress <<- @(*vault, "revAddress")) {
            for (@percentage <<- @(*vault, "percentage")) {
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
                      "publicKeys": publicKeys,
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
  } |

  for (@("PUBLIC_GET_KEY", publicKey, signature, return) <= entryCh) {
    new ch1, hashCh, verifySignatureCh, ch2, ch3 in {
      for (@entryUri <<- entryUriCh) {
        for (@publicKeys <<- @(*vault, "publicKeys")) {
          match publicKeys.get(publicKey) {
            "initialized" => {
              match "\${r}" %% { "r": entryUri } {
                stringUri => {
                  blake2b256!(
                    stringUri.toUtf8Bytes(),
                    *hashCh
                  ) |
                  for (@hash <- hashCh) {
                    secpVerify!(
                      hash,
                      signature.hexToBytes(),
                      publicKey.hexToBytes(),
                      *verifySignatureCh
                    ) |
                    for (@result <- verifySignatureCh) {
                      match result {
                        true => {
                          new keyCh in {
                            for (@publicKeys <- @(*vault, "publicKeys")) {
                              @(*vault, "publicKeys")!(publicKeys.set(publicKey, "registered")) |
                              for (@("PROPOSE_OPERATIONS", operations, return2) <= keyCh) {
                                match operations {
                                  List => {
                                    checkOperationsCh!((operations, publicKey, return2))
                                  }
                                  Nil => {
                                    for (_ <- @(*vault, "operations", publicKey)) {
                                      @(*vault, "operations", publicKey)!(Nil) |
                                      @return!((true, Nil))
                                    }
                                  }
                                  _ => {
                                    @return2!("error: operations is not a List")
                                  }
                                }
                              } |
                              @return!((true, bundle+{*keyCh}))
                            }
                          }
                        }
                        false => {
                          @return!("error: invalid signature")
                        }
                      }
                    }
                  }
                }
              }
            }
            _ => {
              @return!("error: public key already registered")
            }
          }

        }
      }
    }
  } |

  match [
    { "type": "TRANSFER_REV", "amount": Int, "recipient": String }
  ] {
    [op1] => {
      for (@(operations, publicKey, return) <= checkOperationsCh) {
        new itCh in {
          itCh!(operations) |
          for (@tmpOperations <= itCh) {
            match tmpOperations {
              [] => {
                stdout!("error: no operations") |
                @return!("error: no operations")
              }
              [last] => {
                match last {
                  op1 => {
                    for (_ <- @(*vault, "operations", publicKey)) {
                      @(*vault, "operations", publicKey)!(operations) |
                      checkAgreementCh!((operations, publicKey, return))
                    }
                  }
                  _ => {
                    @return!("error: operation is invalid")
                  }
                }
              }
              [first ... rest] => {
                match first {
                  op1 => {
                    itCh!(rest)
                  }
                  _ => {
                    @return!("error: operation is invalid")
                  }
                }
              }
            }
          }
        }
      } |

      for (@(operations, publicKey, return) <= checkAgreementCh) {
        new itCh, howManyCh in {
          howManyCh!(Set()) |
          for (@publicKeys <<- @(*vault, "publicKeys")) {
            for (@percentage <<- @(*vault, "percentage")) {
              itCh!(publicKeys.keys()) |
              for (@tmpPublicKeys <= itCh) {
                match tmpPublicKeys {
                  Set(last) => {
                    for (@op <<- @(*vault, "operations", last)) {
                      match operations.toByteArray() == op.toByteArray() {
                        true => {
                          for (@howMany <- howManyCh) {
                            match howMany.size() + 1 {
                              howMany2 => {
                                stdout!("ok1") |
                                stdout!(howMany2 * 100 / publicKeys.keys().size()) |
                                stdout!(howMany2 * 100 / publicKeys.keys().size() >= percentage) |
                                match howMany2 * 100 / publicKeys.keys().size() >= percentage {
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
                            stdout!("ok2") |
                            stdout!(howMany.size() * 100 / publicKeys.keys().size()) |
                            stdout!(howMany.size() * 100 / publicKeys.keys().size() >= percentage) |
                            match howMany.size() * 100 / publicKeys.keys().size() >= percentage {
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
                    for (@op <<- @(*vault, "operations", first)) {
                      match operations.toByteArray() == op.toByteArray() {
                        true => {
                          for (@howMany <- howManyCh) {
                            stdout!(howMany) |
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
  
      for (@(operations, publicKeys, return) <= executeOperationsCh) {
        stdout!("executeOperationsCh") |
        stdout!((operations, publicKeys, return)) |
        new overCh, overItCh, itCh, indexCh, resultsCh, ch1, ch2, ch3 in {
          for (@v <- overCh) {
            @return!(v) |
            overItCh!(publicKeys) |
            for (@tmpPublicKeys <= overItCh) {
              match tmpPublicKeys {
                Set(last) => {
                  for (_ <- @(*vault, "operations", last)) {
                    @(*vault, "operations", last)!(Nil)
                  }
                }
                Set(first...rest) => {
                  for (_ <- @(*vault, "operations", first)) {
                    @(*vault, "operations", first)!(Nil)
                  } |
                  overItCh!(rest)
                }
              }
            }
          } |

          registryLookup!(\`rho:rchain:revVault\`, *ch1) |
          resultsCh!({}) |
          itCh!(operations) |
          indexCh!(0) |
          for (@(_, RevVault) <- ch1) {
            for (@tmpOperations <= itCh) {
              match tmpOperations {
                [] => {
                  stdout!("error CRITICAL: no operations") |
                  @return!("error CRITICAL: no operations")
                }
                [last] => {
                  for (@index <- indexCh) {
                    for (@revAddress <<- @(*vault, "revAddress")) {
                      for (@revAuthKey <<- @(*vault, "revAuthKey")) {
                        @RevVault!("findOrCreate", revAddress, *ch2) |
                        for (@a <- ch2) {
                          match a {
                            (true, multisigPurseVault) => {
                              @multisigPurseVault!("transfer", last.get("recipient"),  last.get("amount"), revAuthKey, *ch3) |
                              for (@transferResult <- ch3) {
                                match transferResult {
                                  (true, Nil) => {
                                    for (@results <- resultsCh) {
                                      for (_ <- @(*vault, "lastExecutedOperations")) {
                                        @(*vault, "lastExecutedOperations")!(results.set("\${index}" %% { "index": index }, "success"))
                                      } |
                                      overCh!((true, "operations recorded, did execute"))
                                    }
                                  }
                                  (false, message) => {
                                    for (@results <- resultsCh) {
                                      for (_ <- @(*vault, "lastExecutedOperations")) {
                                        @(*vault, "lastExecutedOperations")!(results.set("\${index}" %% { "index": index }, message))
                                      } |
                                      overCh!((true, "operations recorded, did execute"))
                                    }
                                  }
                                }
                              }
                            }
                            _ => {
                              for (@results <- resultsCh) {
                                for (_ <- @(*vault, "lastExecutedOperations")) {
                                  @(*vault, "lastExecutedOperations")!(results.set("\${index}" %% { "index": index }, "error CRITICAL: invalid rev address"))
                                } |
                                overCh!((true, "operations recorded, did execute"))
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                [first...rest] => {
                  for (@index <- indexCh) {
                    indexCh!(index + 1) |
                    for (@revAddress <<- @(*vault, "revAddress")) {
                      for (@revAuthKey <<- @(*vault, "revAuthKey")) {
                        @RevVault!("findOrCreate", revAddress, *ch2) |
                        for (@a <- ch2) {
                          match a {
                            (true, multisigPurseVault) => {
                              @multisigPurseVault!("transfer", first.get("recipient"),  first.get("amount"), revAuthKey, *ch3) |
                              for (@transferResult <- ch3) {
                                match transferResult {
                                  (true, Nil) => {
                                    for (@results <- resultsCh) {
                                      resultsCh!(results.set("\${index}" %% { "index": index }, "success")) |
                                      itCh!(rest)
                                    }
                                  }
                                  (false, message) => {
                                    for (@results <- resultsCh) {
                                      resultsCh!(results.set("\${index}" %% { "index": index }, message)) |
                                      itCh!(rest)
                                    }
                                  }
                                }
                              }
                            }
                            _ => {
                              for (@results <- resultsCh) {
                                resultsCh!(results.set("\${index}" %% { "index": index }, "error CRITICAL: invalid rev address")) |
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
            }
          }
        }
      }
    }
  } |

  insertArbitrary!(bundle+{*entryCh}, *entryUriCh) |

  new itCh, unf, ch1, ch2, ch3, ch4 in {
    for (@tmpPublicKeys <= itCh) {
      match tmpPublicKeys {
        Set() => {
          stdout!("error: no public key") |
          basket!("error: no public key")
        }
        Set(last) => {
          for (@publicKeys <- @(*vault, "publicKeys")) {
            @(*vault, "publicKeys")!(publicKeys.set(last, "initialized")) |
            @(*vault, "operations", last)!(Nil) |
            for (entryUri <<- entryUriCh) {

              registryLookup!(\`rho:rchain:revVault\`, *ch4) |
              for (@(_, RevVault) <- ch4) {
                @RevVault!("unforgeableAuthKey", *unf, *ch1) |
                revAddress!("fromUnforgeable", *unf, *ch2)
              } |

              for (@revAuthKey <- ch1; @revAddress <- ch2) {
                @(*vault, "revAuthKey")!(revAuthKey) |
                @(*vault, "revAddress")!(revAddress) |
                basket!({
                  "status": "completed",
                  "registryUri": *entryUri
                }) |
                stdout!(("rchain-token multisig registered at", *entryUri))
              }
            }
          }
        }
        Set(first ... rest) => {
          for (@publicKeys <- @(*vault, "publicKeys")) {
            @(*vault, "publicKeys")!(publicKeys.set(first, "initialized")) |
            @(*vault, "operations", first)!(Nil) |
            itCh!(rest)
          }
        }
      }
    } |
    itCh!(Set(${payload.publicKeys.map(pk => '"' + pk + '"').join(",")}))
  }
}
`;
};
