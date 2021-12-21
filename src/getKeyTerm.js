/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.getKeyTerm = (
  payload
) => {
  return `new basket,
  masterEntryCh, 
  resultCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  registryLookup!(\`rho:id:${payload.multisigRegistryUri}\`, *masterEntryCh) |

  for (masterEntry <= masterEntryCh) {
    masterEntry!(("PUBLIC_GET_KEY", "${payload.publicKey}", "${payload.signature}", *resultCh)) |
    for (@r <- resultCh) {
      stdout!(r) |
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        (true, p) => {
          @(*deployerId, "rchain-multisig", "${payload.multisigRegistryUri}")!(p) |
          basket!({ "status": "completed" }) |
          stdout!("completed, key recovered")
        }
      }
    }
  }
}
`;
};
