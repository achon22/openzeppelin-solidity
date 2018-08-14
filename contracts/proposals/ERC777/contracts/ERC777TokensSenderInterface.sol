pragma solidity ^0.4.24;

interface ERC777TokensSenderInterface {
    function tokensToSend(
        address operator,
        address from,
        address to,
        uint amount,
        bytes userData,
        bytes operatorData
    ) external;
}
