const { ether } = require('../../helpers/ether');
const { assertBalance, assertTotalSupply } = require('./ERC777Helpers');

const BigNumber = web3.BigNumber;
const ERC777BasicTokenMock = artifacts.require('ERC777BasicTokenMock.sol');
// const ERC777BasicTokenReal = artifacts.require('ERC777BasicToken.sol');

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

contract('ERC777 - BasicToken', accounts => {
  const _name = 'Test 777 Token';
  const _symbol = 'TEST';
  const _granularity = 1;
  const _defaultOperators = [accounts[1], accounts[2]];
  const _owner = accounts[0];
  let erc777BasicToken = null;

  beforeEach(async function () {
    erc777BasicToken = await ERC777BasicTokenMock.new(_name, _symbol, _granularity, _defaultOperators);
  });

  // basic tests
  describe('basic checks', function () {
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

    it('has a total supply of 0 eth', async function () {
      await assertTotalSupply(erc777BasicToken, ether(0));
    });

    it('should have a balance of 0 for all accounts',
      async function () {
        for (let acc in accounts) {
          let balance = await erc777BasicToken.balanceOf(acc);
          balance.should.be.bignumber.equal(0);
        }
      }
    );
    // Ownership test
    it('has the correct owner',
      async function () {
        const owner = await erc777BasicToken.owner();
        owner.should.be.equal(owner);
      }
    );
  });

  describe('minting checks', function () {
    // Minting tests
    //   mint(address _tokenHolder, uint256 _amount, bytes _operatorData);
    it(`should mint 10 ${_symbol} token`,
      async function () {
        await assertBalance(erc777BasicToken, _owner, 0);
        const { logs } = await erc777BasicToken.mint(_owner, ether(10), 'operator data', { from: _owner });
        await assertBalance(erc777BasicToken, _owner, 10);
        await assertTotalSupply(erc777BasicToken, 10);
        assert.equal(logs.length, 1);
        assert.equal(logs[0].event, 'Minted');
        assert.equal(logs[0].args.operator, _owner);
        assert.equal(logs[0].args.to, _owner);
      }
    );

    it(`should not mint ${_symbol} token in less than granularity`,
      async function () {
        let erc777BasicToken = await ERC777BasicTokenMock.new(_name, _symbol, 2, _defaultOperators);
        await assertBalance(erc777BasicToken, _owner, 0);
        await erc777BasicToken
          .mint(_owner, 1, 'operator data', { from: _owner })
          .should.be.rejectedWith('revert');
        await assertBalance(erc777BasicToken, _owner, 0);
        await assertTotalSupply(erc777BasicToken, 0);
      }
    );
  });
});
