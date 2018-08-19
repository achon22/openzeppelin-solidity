pragma solidity 0.4.24;

import { ERC820Implementer } from "../../../ERC820/contracts/ERC820Implementer.sol";
import { ERC820ImplementerInterface } from "../../../ERC820/contracts/ERC820ImplementerInterface.sol";
import { Ownable } from "../../../../ownership/Ownable.sol";
import { ERC777TokensRecipient } from "../ERC777TokensRecipient.sol";


contract ExampleTokensRecipient is ERC820Implementer, ERC820ImplementerInterface, ERC777TokensRecipient, Ownable {

    bool private allowTokensReceived;
    bool public notified;

    constructor(bool _setInterface) public {
        if (_setInterface) {
            setInterfaceImplementation("ERC777TokensRecipient", this);
        }
        allowTokensReceived = true;
        notified = false;
    }

    function tokensReceived (
        address operator,
        address from,
        address to,
        uint amount,
        bytes userData,
        bytes operatorData
    )
        public
    {
        require(allowTokensReceived);
        notified = true;
    }

    function acceptTokens() public onlyOwner {
        allowTokensReceived = true;
    }

    function rejectTokens() public onlyOwner {
        allowTokensReceived = false;
    }

    // solhint-disable-next-line no-unused-vars
    function canImplementInterfaceForAddress(address addr, bytes32 interfaceHash) public view returns(bytes32) {
        return ERC820_ACCEPT_MAGIC;
    }
}
