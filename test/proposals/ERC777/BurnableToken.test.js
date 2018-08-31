const { shouldBehaveLikeBurnableToken } = require('./BurnableToken.behaviour');
const { ether } = require('../../helpers/ether');
const BigNumber = web3.BigNumber;
const ERC777BasicTokenMock = artifacts.require('ERC777BasicTokenMock.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('BurnableToken', accounts => {
  const _name = 'Test 777 Token';
  const _symbol = 'TEST';
  const _granularity = 1;
  const _defaultOperators = [accounts[1], accounts[2]];
  const _owner = accounts[0];
  const _amountEthMinted = 10;

  beforeEach(async function () {
    this.token = await ERC777BasicTokenMock.new(_name, _symbol, _granularity, _defaultOperators);
    await this.token.mint(_owner, ether(_amountEthMinted), 'operator data', { from: _owner });
  });

  shouldBehaveLikeBurnableToken(_owner, _amountEthMinted);
});
