const pify = require('pify');

const ethAsync = pify(web3.eth);

module.exports = {
  ethGetCode: ethAsync.getCode,
  ethGetBalance: ethAsync.getBalance,
  ethSendTransaction: ethAsync.sendTransaction,
  ethSendRawTransaction: ethAsync.sendRawTransaction,
  ethGetBlock: ethAsync.getBlock,
  sha3: web3.sha3
};
