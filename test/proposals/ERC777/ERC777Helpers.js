const { ether } = require('../../helpers/ether');
const BigNumber = web3.BigNumber;
require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const assertBalance = async function (token, account, expected) {
  const balance = await token.balanceOf(account);
  balance.should.be.bignumber.equal(ether(expected));
};

const assertTotalSupply = async function (token, expected) {
  const totalSupply = await token.totalSupply();
  totalSupply.should.be.bignumber.equal(ether(expected));
};

module.exports = { assertBalance, assertTotalSupply };
