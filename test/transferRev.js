const rchainToolkit = require('@fabcotech/rchain-toolkit');;
const getBalance = require('./getBalance').main;

module.exports.main = async (privateKey, from, to, amount) => {

  const b1 = await getBalance(to);
  if (b1 < 100000000) {
    console.log(to, 'has less than 1 REV, initiate transfer from', from)
  } else {
    return;
  }

  let term = `new
  deployId(\`rho:rchain:deployId\`),
  rl(\`rho:registry:lookup\`),
  RevVaultCh,
  stdout(\`rho:io:stdout\`)
in {

rl!(\`rho:rchain:revVault\`, *RevVaultCh) |
for (@(_, RevVault) <- RevVaultCh) {
  stdout!(("Started transfer")) |
  match (
    "${from}",
    "${to}",
    ${amount}
  ) {
    (from, to, amount) => {

      new vaultCh, vaultTo, revVaultkeyCh, deployerId(\`rho:rchain:deployerId\`) in {
        @RevVault!("findOrCreate", from, *vaultCh) |
        @RevVault!("findOrCreate", to, *vaultTo) |
        @RevVault!("deployerAuthKey", *deployerId, *revVaultkeyCh) |
        for (@result <- vaultCh; key <- revVaultkeyCh; _ <- vaultTo) {
          stdout!(result) |
          match result {
            (true, vault) => {
              stdout!(("Beginning transfer of " , amount , " dust from " , from , " to " , to)) |
              new resultCh in {
                @vault!("transfer", to, amount, *key, *resultCh) |
                for (@result2 <- resultCh) {
                  stdout!(result2) |
                  match result2 {
                    (true, Nil) => {
                      stdout!(("Finished transfer of " , amount , " dusts to " , to)) |
                      deployId!({ "status": "completed" })
                    }
                    _ => {
                      stdout!("Failed to transfer REV (vault transfer)") |
                      deployId!({ "status": "failed", "message": "Failed to transfer REV (vault transfer)" })
                    }
                  }
                }
              }
            }
            _ => {
              stdout!("Failed to transfer REV (vault not found)") |
              deployId!({ "status": "failed", "message": "Failed to transfer REV (vault not found)" })
            }
          }
        }
      }
    }
  }
}
}`;


    let dataAtNameResponse;
    try {
      dataAtNameResponse = await rchainToolkit.http.easyDeploy(
          process.env.VALIDATOR_HOST,
          {
            privateKey: privateKey,
            shardId: process.env.SHARD_ID,
            term: term,
            phloPrice: 1,
            phloLimit: 10000000,
            timeout: 3 * 60 * 1000
          }
      );
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }

    return null;
};
