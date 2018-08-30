const { assertRevert } = require('../../helpers/assertRevert');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

function shouldBehaveLikeERC777Token (_name, _symbol, _granularity) {
  console.log('this token is:')
  console.log(this.token);
  it('has a name', async function () {
    const name = await this.token.name();
    name.should.be.equal(_name);
  });

  // it('has a symbol', async function () {
  //   const symbol = await detailedERC20.symbol();
  //   symbol.should.be.equal(_symbol);
  // });
  //
  // it('has an amount of decimals', async function () {
  //   const decimals = await detailedERC20.decimals();
  //   decimals.should.be.bignumber.equal(_decimals);
  // });

  // describe('as a basic ERC-777 token', function () {
  //   describe('after token creation', function () {
  //     it('name should be Test 777 Token', async function () {
  //       const name = await this.token.name();
  //       name.should.equal('Test 777 Token');
  //     });
  //   });
  // });
}

module.exports = {
  shouldBehaveLikeERC777Token,
};
