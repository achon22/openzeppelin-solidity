// const TestRPC = require('ganache-cli');
// const web3 = require('web3');
const chai = require('chai');
const { ether } = require('../../helpers/ether');
const { ethGetCode, ethSendTransaction, ethSendRawTransaction, sha3} = require('../../helpers/web3');
const BigNumber = web3.BigNumber;
const ExampleImplementer = artifacts.require('ExampleImplementer');
const ExampleImplementer2 = artifacts.require('ExampleImplementer2');

const EthereumTx = require('ethereumjs-tx');
const EthereumUtils = require('ethereumjs-util');

const ERC820Registry = artifacts.require('ERC820Registry');

const assert = chai.assert;

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();


contract('ERC820Registry', accounts => {
    describe('ERC820 Test', () => {
        let erc820Registry;
        let addr;
        let implementer;
        let implementer2;
        let manager1;
        let manager2;
        let interfaceHash;
        before(async () => {
            erc820Registry = await deploy(accounts[0]);
            addr = accounts[0];
            console.log(await erc820Registry.getManager(addr), ' should equal ', addr, ' but it doesnt.. why?!');
            manager1 = accounts[2];
            manager2 = accounts[3];
        });

        it('should deploy ERC820', async () => {
            assert.ok(erc820Registry.address);
            // console.log(erc820Registry.address)
        });

        it('should deploy implementer', async () => {
            implementer = await ExampleImplementer.new();
            assert.ok(implementer.address);
            // console.log(implementer.address);
        });


        it('should deploy implementer2', async () => {
            implementer2 = await ExampleImplementer2.new();
            assert.ok(implementer2.address);
        });

        it('should set an address', async () => {
            interfaceHash = await erc820Registry.interfaceHash("ERC820ExampleImplementer2");
            assert.equal(interfaceHash, sha3("ERC820ExampleImplementer2"));
            console.log(await erc820Registry.getManager(addr), addr);
            await erc820Registry.setInterfaceImplementer(addr, interfaceHash, implementer.address, {from: addr});
            // const rImplementer = await erc820Registry.getInterfaceImplementer(addr, interfaceHash);
            // assert.equal(rImplementer, implementer.address);
        });

        // it('should change manager', async () => {
        //     await erc820Registry.setManager("0x0000000000000000000000000000000000000000", manager1, {from: addr});
        //     const rManager1 = await erc820Registry.getManager(addr);
        //     assert.equal(rManager1, manager1);
        // });
        //
        // it('manager should remove interface', async() => {
        //     await erc820Registry.setInterfaceImplementer(addr, interfaceHash, 0, {from: manager1, gas: 200000});
        //     const rImplementer = await erc820Registry.getInterfaceImplementer(addr, interfaceHash);
        //     assert.equal(rImplementer, "0x0000000000000000000000000000000000000000");
        // });
        //
        // it('address should change back the interface', async() => {
        //     await erc820Registry.setInterfaceImplementer(addr, interfaceHash, implementer.address, {from: manager1});
        //     const rImplementer = await erc820Registry.getInterfaceImplementer(addr, interfaceHash);
        //     assert.equal(rImplementer, implementer.address);
        // });
        //
        // it('manager should change manager', async() => {
        //     await erc820Registry.setManager(addr, manager2, {from: manager1});
        //     const rManager2 = await erc820Registry.getManager(addr);
        //     assert.equal(rManager2, manager2);
        // });
        //
        // it('address should remove interface', async() => {
        //     await erc820Registry.setInterfaceImplementer(addr, interfaceHash, 0, {from: manager2, gas: 200000});
        //     const rImplementer = await erc820Registry.getInterfaceImplementer(addr, interfaceHash);
        //     assert.equal(rImplementer, "0x0000000000000000000000000000000000000000");
        // });
        //
        // it('Should not allow to set an interface an invalid contract', async() => {
        //     const tx = await erc820Registry.setInterfaceImplementer(addr, interfaceHash, erc820Registry.address, {from: manager2, gas: 200000});
        //     assert.equal("0x00", tx.status)
        // });
        //
        // it('manager should set back interface', async() => {
        //     await erc820Registry.setInterfaceImplementer(addr, interfaceHash, implementer.address, {from: manager2, gas: 200000});
        //     const rImplementer = await erc820Registry.getInterfaceImplementer(addr, interfaceHash);
        //     assert.equal(rImplementer, implementer.address);
        // });
        //
        // it('address should remove manager', async() => {
        //     await erc820Registry.setManager(addr, 0, {from: manager2, gas: 200000});
        //     const rManager = await erc820Registry.getManager(addr);
        //     assert.equal(rManager, addr);
        // });
        //
        // it('manager should not be able to change interface', async() => {
        //     let errorDetected;
        //     const tx = await erc820Registry.setInterfaceImplementer(addr, interfaceHash, 0, {from: manager2, gas: 200000});
        //     assert.equal("0x00", tx.status);
        // });
    });
});




generateDeployTx = () => {
    const rawTx = {
        nonce: 0,
        gasPrice: 100000000000,
        gasLimit: 800000,
        value: 0,
        data: '0x608060405234801561001057600080fd5b50610a3e806100206000396000f30060806040526004361061008d5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166329965a1d81146100925780633d584063146100bf5780635df8122f146100fc57806365ba36c114610123578063a41e7d511461018e578063aabbb8ca146101bc578063b7056765146101e0578063f712f3e814610222575b600080fd5b34801561009e57600080fd5b506100bd600160a060020a036004358116906024359060443516610250565b005b3480156100cb57600080fd5b506100e0600160a060020a036004351661054b565b60408051600160a060020a039092168252519081900360200190f35b34801561010857600080fd5b506100bd600160a060020a0360043581169060243516610597565b34801561012f57600080fd5b506040805160206004803580820135601f810184900484028501840190955284845261017c9436949293602493928401919081908401838280828437509497506106aa9650505050505050565b60408051918252519081900360200190f35b34801561019a57600080fd5b506100bd600160a060020a0360043516600160e060020a031960243516610774565b3480156101c857600080fd5b506100e0600160a060020a03600435166024356107fe565b3480156101ec57600080fd5b5061020e600160a060020a0360043516600160e060020a031960243516610878565b604080519115158252519081900360200190f35b34801561022e57600080fd5b5061020e600160a060020a0360043516600160e060020a03196024351661092d565b6000600160a060020a038416156102675783610269565b335b9050336102758261054b565b600160a060020a0316146102d3576040805160e560020a62461bcd02815260206004820152600f60248201527f4e6f7420746865206d616e616765720000000000000000000000000000000000604482015290519081900360640190fd5b6102dc836109a3565b15610331576040805160e560020a62461bcd02815260206004820152601960248201527f4d757374206e6f74206265206120455243313635206861736800000000000000604482015290519081900360640190fd5b600160a060020a038216158015906103525750600160a060020a0382163314155b156104da5760405160200180807f4552433832305f4143434550545f4d414749430000000000000000000000000081525060130190506040516020818303038152906040526040518082805190602001908083835b602083106103c65780518252601f1990920191602091820191016103a7565b51815160209384036101000a6000190180199092169116179052604080519290940182900382207ff0083250000000000000000000000000000000000000000000000000000000008352600160a060020a038881166004850152602484018b90529451909650938816945063f0083250936044808401945091929091908290030181600087803b15801561045957600080fd5b505af115801561046d573d6000803e3d6000fd5b505050506040513d602081101561048357600080fd5b5051146104da576040805160e560020a62461bcd02815260206004820181905260248201527f446f6573206e6f7420696d706c656d656e742074686520696e74657266616365604482015290519081900360640190fd5b600160a060020a03818116600081815260208181526040808320888452909152808220805473ffffffffffffffffffffffffffffffffffffffff19169487169485179055518692917f93baa6efbd2244243bfee6ce4cfdd1d04fc4c0e9a786abd3a41313bd352db15391a450505050565b600160a060020a038082166000908152600160205260408120549091161515610575575080610592565b50600160a060020a03808216600090815260016020526040902054165b919050565b6000600160a060020a038316156105ae57826105b0565b335b9050336105bc8261054b565b600160a060020a03161461061a576040805160e560020a62461bcd02815260206004820152600f60248201527f4e6f7420746865206d616e616765720000000000000000000000000000000000604482015290519081900360640190fd5b80600160a060020a031682600160a060020a031614610639578161063c565b60005b600160a060020a03828116600081815260016020526040808220805473ffffffffffffffffffffffffffffffffffffffff19169585169590951790945592519185169290917f605c2dbf762e5f7d60a546d42e7205dcb1b011ebc62a61736a57c9089d3a43509190a3505050565b6000816040516020018082805190602001908083835b602083106106df5780518252601f1990920191602091820191016106c0565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040526040518082805190602001908083835b602083106107425780518252601f199092019160209182019101610723565b5181516020939093036101000a6000190180199091169216919091179052604051920182900390912095945050505050565b61077e8282610878565b61078957600061078b565b815b600160a060020a03928316600081815260208181526040808320600160e060020a031996909616808452958252808320805473ffffffffffffffffffffffffffffffffffffffff19169590971694909417909555908152600284528181209281529190925220805460ff19166001179055565b60008080600160a060020a038516156108175784610819565b335b9150610824846109a3565b15610849575082610835828261092d565b610840576000610842565b815b9250610870565b600160a060020a038083166000908152602081815260408083208884529091529020541692505b505092915050565b600080806108a6857f01ffc9a7000000000000000000000000000000000000000000000000000000006109c5565b90925090508115806108b6575080155b156108c45760009250610870565b6108d685600160e060020a03196109c5565b90925090508115806108e757508015155b156108f55760009250610870565b6108ff85856109c5565b90925090506001821480156109145750806001145b156109225760019250610870565b506000949350505050565b600160a060020a0382166000908152600260209081526040808320600160e060020a03198516845290915281205460ff16151561096e5761096e8383610774565b50600160a060020a03918216600090815260208181526040808320600160e060020a0319949094168352929052205416151590565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff161590565b6040517f01ffc9a7000000000000000000000000000000000000000000000000000000008082526004820183905260009182919060208160088189617530fa9051909690955093505050505600a165627a7a72305820d7a046a893933c751f4ed1e1bf58b90e558d06cdbf8d9da5ccd8814b9acce4510029',
        v: 27,
        r: '0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798',
        s: '0x0aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    };
    const tx = new EthereumTx(rawTx);
    const res = {
        sender: EthereumUtils.toChecksumAddress('0x' + tx.getSenderAddress().toString('hex')),
        rawTx: '0x' + tx.serialize().toString('hex'),
        contractAddr: EthereumUtils.toChecksumAddress(
            '0x' + EthereumUtils.generateAddress('0x' + tx.getSenderAddress().toString('hex'), 0 ).toString('hex')),
    };
    return res;
};


deploy = async (account) => {
    const res = generateDeployTx();
    const deployedCode = await ethGetCode(res.contractAddr);

    if (deployedCode.length <= 3 ) {
        await ethSendTransaction({
            from: account, to: res.sender, value: '100000000000000000'/* web3.utils.toWei(0.1) */
        });
        await ethSendRawTransaction(res.rawTx);
    }
    return new ERC820Registry(res.contractAddr);
};

