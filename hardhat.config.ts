require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: ["0x3d70d69d35b71a73dae1e685eaa389fe3801fd3ac6fc61d0b73d287576c09598"]
    }
  }
};
