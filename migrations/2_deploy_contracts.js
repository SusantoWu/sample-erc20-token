const SSTToken = artifacts.require('SSTToken')

module.exports = function (deployer) {
  deployer.deploy(SSTToken)
}
