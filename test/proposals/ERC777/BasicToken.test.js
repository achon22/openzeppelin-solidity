const { ether } = require('../../helpers/ether');
const { sendTransaction } = require('../../helpers/sendTransaction');
const { assertBalance, assertTotalSupply } = require('./ERC777Helpers');
const { assertRevert } = require('../../helpers/assertRevert');
const { ethGetBlock } = require('../../helpers/web3');

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
        erc777BasicToken = await ERC777BasicTokenMock.new(_name, _symbol, _granularity, _defaultOperators, { from: _owner });
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

        it(`should mint 10 ${_symbol} token`,
            async function () {
                await assertBalance(erc777BasicToken, _owner, 0);
                const { logs } = await erc777BasicToken.mint(_owner, ether(10), 'operator data', { from: _owner });
                await assertBalance(erc777BasicToken, _owner, 10);
                await assertTotalSupply(erc777BasicToken, 10);
                logs.length.should.equal(1);
                logs[0].event.should.equal('Minted');
                logs[0].args.operator.should.equal(_owner);
                logs[0].args.to.should.equal(_owner);
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

    describe('send checks', function () {

        beforeEach(async function () {
            erc777BasicToken = await ERC777BasicTokenMock.new(_name, _symbol, _granularity, _defaultOperators, { from: _owner });
            await erc777BasicToken.mint(accounts[0], ether(10), "", { from: _owner });
            await erc777BasicToken.mint(accounts[1], ether(10), "", { from: _owner });
            await erc777BasicToken.mint(accounts[2], ether(10), "", { from: _owner });
        });

        it(`should let ${accounts[1].slice(0, 8)} send 3 ${_symbol} with empty data ` +
            `to ${accounts[2].slice(0, 8)}`, async function () {
            await assertTotalSupply(erc777BasicToken, 30);
            await assertBalance(erc777BasicToken, accounts[0], 10);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
            // await erc777BasicToken.send(accounts[2], 1, '');
            await erc777BasicToken.sendTokens(accounts[0], accounts[2], ether(3), "", accounts[0], "", false, { from: accounts[0], gas: 300000 });
            await assertTotalSupply(erc777BasicToken, 30);
            await assertBalance(erc777BasicToken, accounts[0], 7);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 13);
        });

        it(`should let ${accounts[1].slice(0, 8)} send 3 ${_symbol} with data ` +
            `to ${accounts[2].slice(0, 8)}`, async function () {
            await assertTotalSupply(erc777BasicToken, 10 * 3);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
            await erc777BasicToken.sendTokens(accounts[1], accounts[2], ether(3), 'test', accounts[1], "", false, { from: accounts[1] });
            await assertTotalSupply(erc777BasicToken, 10 * 3);
            await assertBalance(erc777BasicToken, accounts[1], 7);
            await assertBalance(erc777BasicToken, accounts[2], 13);
        });

        it(`should not let ${accounts[1].slice(0, 8)} ` +
            `send 11 ${_symbol} (not enough funds)`, async function () {
            await assertTotalSupply(erc777BasicToken, 10 * 3);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
            await assertRevert(erc777BasicToken.sendTokens(accounts[1], accounts[2], ether(11), 'test', accounts[1], "", false, { from: accounts[1] }));
            await assertTotalSupply(erc777BasicToken, 10 * 3);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
        });

        it(`should not let ${accounts[1].slice(0, 8)} ` +
            `send ${_symbol} to 0x0 (zero-account)`, async function () {
            await assertTotalSupply(erc777BasicToken, 10 * 3);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
            await assertRevert(erc777BasicToken.sendTokens(accounts[1], '0x0', ether(1), 'test', accounts[1], "", false, { from: accounts[1] }));
            await assertTotalSupply(erc777BasicToken, 10 * 3);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
        });
    });

    describe('basic operator checks', function () {
        it(`verify isOperatorFor function for default operator`, async function () {
            await erc777BasicToken.isOperatorFor(accounts[2], accounts[6]);
        });

        it(`verify isOperatorFor function for newly set operator`, async function () {
            await erc777BasicToken.authorizeOperator(accounts[4], { from: accounts[0], gas: 300000 });
            await erc777BasicToken.isOperatorFor(accounts[4], accounts[0]);
        });

        it(`verify that a  ${accounts[4].slice(0,8)} cannot set himself as an operator`, async function () {
            await assertRevert(erc777BasicToken.authorizeOperator(accounts[4], { from: accounts[4], gas: 300000 }));
        });


    });

    describe('operatorSend checks', function () {

        beforeEach(async function () {
            erc777BasicToken = await ERC777BasicTokenMock.new(_name, _symbol, _granularity, _defaultOperators, { from: _owner });
            await erc777BasicToken.mint(accounts[0], ether(10), "", { from: _owner });
            await erc777BasicToken.mint(accounts[1], ether(10), "", { from: _owner });
            await erc777BasicToken.mint(accounts[2], ether(10), "", { from: _owner });
        });

        it(`test that default operator ${accounts[1].slice(0,8)} can send 3 ${_symbol} from ${accounts[2].slice(0, 8)} with empty data`, async function () {
            await assertTotalSupply(erc777BasicToken, 30);
            await assertBalance(erc777BasicToken, accounts[0], 10);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
            await erc777BasicToken.operatorSend(accounts[2], accounts[4], ether(3), "", "", { from: accounts[1] });
            await assertTotalSupply(erc777BasicToken, 30);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 7);
            await assertBalance(erc777BasicToken, accounts[4], 3);
        });

        it(`test that a non-operator  ${accounts[4].slice(0,8)} cannot move ${_symbol} from ${accounts[2].slice(0, 8)} `, async function () {
            await assertTotalSupply(erc777BasicToken, 30);
            await assertBalance(erc777BasicToken, accounts[0], 10);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
            await assertRevert(erc777BasicToken.operatorSend(accounts[2], accounts[4], ether(3), "", "", { from: accounts[4] }));
            await assertTotalSupply(erc777BasicToken, 30);
            await assertBalance(erc777BasicToken, accounts[0], 10);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
        });

        it(`test that operator ${accounts[4].slice(0,8)} can send 3 ${_symbol} from ${accounts[0].slice(0, 8)}`, async function () {
            await assertTotalSupply(erc777BasicToken, 30);
            await assertBalance(erc777BasicToken, accounts[0], 10);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
            await erc777BasicToken.authorizeOperator(accounts[4], { from: accounts[0], gas: 300000 });
            await erc777BasicToken.operatorSend(accounts[0], accounts[4], ether(3), "", "", { from: accounts[4] });
            await assertTotalSupply(erc777BasicToken, 30);
            await assertBalance(erc777BasicToken, accounts[0], 7);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
            await assertBalance(erc777BasicToken, accounts[4], 3);
        });

        it(`${accounts[0].slice(0,8)} can operatorSend 3 ${_symbol} from itself`, async function () {
            await assertTotalSupply(erc777BasicToken, 30);
            await assertBalance(erc777BasicToken, accounts[0], 10);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
            await erc777BasicToken.operatorSend(accounts[0], accounts[4], ether(3), "", "", { from: accounts[0] });
            await assertTotalSupply(erc777BasicToken, 30);
            await assertBalance(erc777BasicToken, accounts[0], 7);
            await assertBalance(erc777BasicToken, accounts[1], 10);
            await assertBalance(erc777BasicToken, accounts[2], 10);
            await assertBalance(erc777BasicToken, accounts[4], 3);
        });

    });
});

