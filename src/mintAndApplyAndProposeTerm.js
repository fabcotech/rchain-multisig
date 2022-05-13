const { mintTerm } = require('./mintTerm');
const { proposeOperationsChannelTerm } = require('./proposeOperationsChannelTerm');
const { applyTerm } = require('./applyTerm');

module.exports.mintAndApplyAndProposeTerm = (
  payload
) => {

  const term1 = mintTerm(payload);
  const indexStart = term1.indexOf('// OP_MINT_COMPLETED_BEGIN');
  const indexEnd = term1.indexOf('// OP_MINT_COMPLETED_END');

  const term2 = term1.slice(0, indexStart) + term1.slice(indexEnd).replace(
    `// OP_MINT_COMPLETED_END`,
    `${applyTerm(payload)
        .replace('deployId(\`rho:rchain:deployId\`),', '')
        .replace('`rho:id:undefined`', 'r.get("registryUri")')
        .replace('"undefined"', 'r.get("registryUri")')
      }`
  );

  const indexStart2 = term2.indexOf('// OP_APPLY_COMPLETED_BEGIN');
  const indexEnd2 = term2.indexOf('// OP_APPLY_COMPLETED_END');
  const term3 = term2.slice(0, indexStart2) + term2.slice(indexEnd2).replace(
    `// OP_APPLY_COMPLETED_END`,
    `| ${proposeOperationsChannelTerm(payload)
        .replace('deployId(\`rho:rchain:deployId\`),', '')
        .replace('"undefined"', 'r.get("registryUri")')
      }`
  );

  return term3;
};
