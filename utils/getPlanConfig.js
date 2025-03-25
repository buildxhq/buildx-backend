const planConfig = require('./planConfig');

function getPlanConfig(role, tier) {
  return planConfig[role]?.[tier] || {};
}

module.exports = getPlanConfig;
