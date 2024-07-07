module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();
    await deploy('NFT_Marketplace', {
      from: deployer,
      args: [],
      log: true,
    });
  };
  module.exports.tags = ['NFT_Marketplace'];