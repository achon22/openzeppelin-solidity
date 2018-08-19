pragma solidity 0.4.24;

import { ERC820Implementer } from "../../../ERC820/contracts/ERC820Implementer.sol";
import { ERC820ImplementerInterface } from "../../../ERC820/contracts/ERC820ImplementerInterface.sol";
import { Ownable } from "../../../../ownership/Ownable.sol";
import { ERC777TokensSender } from "../ERC777TokensSender.sol";

contract ExampleTokensSender is ERC820Implementer, ERC820ImplementerInterface, ERC777TokensSender, Ownable {
    bool private allowTokensToSend;
    bool public notified;

    constructor(bool _setInterface) public {
        if (_setInterface) { setInterfaceImplementation("ERC777TokensSender", this); }
        allowTokensToSend = true;
        notified = false;
    }

    function tokensToSend(
        address operator,   // solhint-disable no-unused-vars
        address from,
        address to,
        uint amount,
        bytes userData,
        bytes operatorData
    )  // solhint-enable no-unused-vars
    public {
        require(allowTokensToSend);
        notified = true;
    }

    function acceptTokensToSend() public onlyOwner { allowTokensToSend = true; }

    function rejectTokensToSend() public onlyOwner { allowTokensToSend = false; }

    // solhint-disable-next-line no-unused-vars
    function canImplementInterfaceForAddress(address addr, bytes32 interfaceHash) public view returns(bytes32) {
        return ERC820_ACCEPT_MAGIC;
    }

}
