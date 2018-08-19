pragma solidity ^0.4.24;

contract ERC820Registry {
    function getManager(address addr) public view returns(address);
    function setManager(address addr, address newManager) public;
    function getInterfaceImplementer(address addr, bytes32 interfaceHash) public constant returns (address);
    function setInterfaceImplementer(address addr, bytes32 interfaceHash, address implementer) public;
}

contract ERC820Implementer {
    ERC820Registry erc820Registry = ERC820Registry(0xbe78655dff872d22b95ae366fb3477d977328ade);

    function setInterfaceImplementation(string interfaceLabel, address implementation) internal {
        bytes32 interfaceHash = keccak256(interfaceLabel);
        erc820Registry.setInterfaceImplementer(this, interfaceHash, implementation);
    }

    function interfaceAddr(address addr, string interfaceLabel) internal constant returns(address) {
        bytes32 interfaceHash = keccak256(interfaceLabel);
        return erc820Registry.getInterfaceImplementer(addr, interfaceHash);
    }

    function delegateManagement(address newManager) internal {
        erc820Registry.setManager(this, newManager);
    }
}