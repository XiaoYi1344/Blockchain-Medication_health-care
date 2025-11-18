require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
    
  },

  networks: {
    hardhat: {
      chainId: 1337,
    },
    zeroscan: {
      url: "https://rpc.zeroscan.org",
      accounts: [
        "0xbb96d14c636e59149d2323e58127326739028890e3d9e8cd7ef15d76a030a16b",
      ],
      chainId: 5080,
    },
  },
  etherscan: {
    apiKey: {
      zeroscan: "0x00000000000",
    },
    customChains: [
      {
        network: "zeroscan",
        chainId: 5080,
        urls: {
          apiURL: "https://zeroscan.org/api", // API xác minh
          browserURL: "https://zeroscan.org", // Trình duyệt Explorer
        },
      },
    ],
  },
};
