const { ether } = require('../../helpers/ether');
const { assertRevert } = require('../../helpers/assertRevert');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

function shouldBehaveLikeBurnableToken (owner, accounts, amountMinted) {
  describe('as a basic burnable token', async function () {
    const from = owner;

    describe('when the given amount is not greater than balance of the sender', async function () {
      const amount = 2;
      it('burns the requested amount', async function () {
        const balance = await this.token.balanceOf(from);
        await this.token.operatorBurn(from, ether(amount), 'user data', 'operator data', { from: from });
        balance.should.be.bignumber.equal(balance - amount);
      });

      it('emits a burn event', async function () {
        const { logs } = await this.token.operatorBurn(from, ether(amount), 'user data', 'operator data', { from: from });
        logs.length.should.equal(1);
        logs[0].event.should.equal('Burned');
        logs[0].args.operator.should.equal(from);
        logs[0].args.from.should.equal(from);
      });
    });

    describe('when the given amount is not greater than balance of the sender and being burned by ' +
        'operator', async function () {
      const amount = 2;
      const operator = accounts[1];
      it('burns the requested amount', async function () {
        const balance = await this.token.balanceOf(from);
        await this.token.operatorBurn(from, ether(amount), 'user data', 'operator data', { from: operator });
        balance.should.be.bignumber.equal(balance - amount);
      });

      it('emits a burn event', async function () {
        const { logs } = await this.token.operatorBurn(from, ether(amount), 'user data', 'operator data', { from: operator });
        logs.length.should.equal(1);
        logs[0].event.should.equal('Burned');
        logs[0].args.operator.should.equal(operator);
        logs[0].args.from.should.equal(from);
      });
    });

    describe('when the given amount is greater than the balance of the sender', async function () {
      it('reverts', async function () {
        const balance = await this.token.balanceOf(from);
        const amount = balance + 1;
        await assertRevert(this.token.operatorBurn(from, ether(amount), 'user data', 'operator data', { from: from }));
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeBurnableToken,
};
