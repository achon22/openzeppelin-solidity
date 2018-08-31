const { ether } = require('../../helpers/ether');
const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

function shouldBehaveLikeBurnableToken (owner, amountMinted) {
  describe('as a basic burnable token', async function () {
    const from = owner;
    it('when the given amount is not greater than balance of the sender', async function () {
      const { logs } = await this.token.burn(from, ether(amountMinted), 'user data', 'operator data', { from: from });
    });

  });
}

module.exports = {
  shouldBehaveLikeBurnableToken,
};
