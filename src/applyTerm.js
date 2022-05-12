/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.applyTerm = (
  payload
) => {
  return `new basket,
  masterEntryCh,
  applicationCh,
  resultCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.multisigRegistryUri}\`, *masterEntryCh) |

  for (masterEntry <= masterEntryCh) {
    masterEntry!(("PUBLIC_APPLY", "${payload.applicationId}", bundle+{*applicationCh}, bundle+{*resultCh})) |

    // application accepted
    for (@key <- applicationCh) {
      stdout!("application was accepted") |
      @(*deployerId, "rchain-multisig", "${payload.multisigRegistryUri}", "${payload.applicationId}")!(key)
      // OP_APPLY_COMPLETED_BEGIN
      // OP_APPLY_COMPLETED_END
    } |

    // application recorded
    for (@r <- resultCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, p) => {
          basket!({ "status": "completed", "message": p }) |
          stdout!(p)
        }
      }
    }
  }
}
`;
};
