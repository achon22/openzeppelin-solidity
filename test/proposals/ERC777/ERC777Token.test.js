const { ether } = require('../../helpers/ether');
const { assertRevert } = require('../../helpers/assertRevert');
const { sendTransaction } = require('../../helpers/sendTransaction');
const { shouldBehaveLikeERC777Token } = require('./ERC777Token.behaviour');
const _ = require('lodash');

const BigNumber = web3.BigNumber;
const ERC777BasicTokenMock = artifacts.require('ERC777BasicTokenMock.sol');
// const ERC777BasicTokenReal = artifacts.require('ERC777BasicToken.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('ERC777BasicToken', accounts => {
  const _name = 'Test 777 Token';
  const _symbol = 'TEST';
  const _granularity = 1;

  let erc777BasicToken = null;

  beforeEach(async function () {
    erc777BasicToken = await ERC777BasicTokenMock.new(_name, _symbol, _granularity);
  });

  it('has a name', async function () {
    const name = await erc777BasicToken.name();
    name.should.be.equal(_name);
  });

  it('has a symbol', async function () {
    const symbol = await erc777BasicToken.symbol();
    symbol.should.be.equal(_symbol);
  });

  it('has an amount of _granularity', async function () {
    const granularity = await erc777BasicToken.granularity();
    granularity.should.be.bignumber.equal(_granularity);
  });

});
