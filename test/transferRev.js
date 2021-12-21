const rchainToolkit = require('rchain-toolkit');

require('dotenv').config();

module.exports.main = async (privateKey, from, to, amount) => {
  let term = `new
  basket,
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
                      basket!({ "status": "completed" })
                    }
                    _ => {
                      stdout!("Failed to transfer REV (vault transfer)") |
                      basket!({ "status": "failed", "message": "Failed to transfer REV (vault transfer)" })
                    }
                  }
                }
              }
            }
            _ => {
              stdout!("Failed to transfer REV (vault not found)") |
              basket!({ "status": "failed", "message": "Failed to transfer REV (vault not found)" })
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
          term,
          privateKey,
          1,
          10000000,
          10 * 60 * 1000
      );
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }

    return null;
};
