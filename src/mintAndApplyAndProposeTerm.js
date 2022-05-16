const { mintTerm } = require('./mintTerm');
const { proposeOperationsChannelTerm } = require('./proposeOperationsChannelTerm');
const { applyTerm } = require('./applyTerm');

module.exports.mintAndApplyAndProposeTerm = (
  payload
) => {

  const term1 = mintTerm(payload);
  const indexStart = term1.indexOf('// OP_MINT_COMPLETED_BEGIN');
  const indexEnd = term1.indexOf('// OP_MINT_COMPLETED_END');
  const term2 = term1.slice(0, indexStart) + term1.slice(indexEnd)
  .replace('`rho:id:undefined`', 'rmint.get("registryUri")')
  .replace(
    `// OP_MINT_COMPLETED_END`,
    `${applyTerm(payload)
        .replace('deployId(\`rho:rchain:deployId\`),', '')
        .replace(/\`rho:id:undefined\`/g, `rmint.get("registryUri")`)
      }`
  );

  const indexStart2 = term2.indexOf('// OP_APPLY_COMPLETED_BEGIN');
  const indexEnd2 = term2.indexOf('// OP_APPLY_COMPLETED_END');
  let term3 = term2.slice(0, indexStart2) + term2.slice(indexEnd2).replace(
    `// OP_APPLY_COMPLETED_END`,
    `${proposeOperationsChannelTerm(payload)
        .replace('deployId(\`rho:rchain:deployId\`),', '')
        .replace(/\`rho:id:undefined\`/g, `rmint.get("registryUri")`)
      } |`
  );

  const indexStart3 = term3.indexOf('// OP_PROPOSE_OPERATIONS_CHANNEL_COMPLETED_BEGIN');
  const indexEnd3 = term3.indexOf('// OP_PROPOSE_OPERATIONS_CHANNEL_COMPLETED_END');

  term3 = term3.slice(0, indexStart3) + 'deployId!(rmint) \n' + term3.slice(indexEnd3);

  return term3;
};
