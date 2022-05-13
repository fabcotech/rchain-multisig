/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.applyTerm = (
  payload
) => {
  return `new deployId(\`rho:rchain:deployId\`),
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
      @(*deployerId, "rchain-multisig", \`rho:id:${payload.multisigRegistryUri}\`, "${payload.applicationId}")!(key)
    } |

    // application recorded
    for (@r <- resultCh) {
      match r {
        String => {
          deployId!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, p) => {
          // OP_APPLY_COMPLETED_BEGIN
          deployId!({ "status": "completed", "message": p }) |
          // OP_APPLY_COMPLETED_END
          stdout!(p)
        }
      }
    }
  }
}
`;
};
