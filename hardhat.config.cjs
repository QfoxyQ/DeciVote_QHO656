require("@nomicfoundation/hardhat-ethers");

module.exports = {
  solidity: "0.8.19",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      chainId: 1337,
      accounts: ["0x2983a46949f6658bf03bb9657ab59a607b37fe8a7edf4e5f0508c472f1b587dd"]
    }
  }
};
