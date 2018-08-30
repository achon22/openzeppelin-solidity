pragma solidity ^0.4.24;

contract ERC820Registry {
    function getManager(address addr) public view returns(address);
    function setManager(address addr, address newManager) public;
    function getInterfaceImplementer(address addr, bytes32 interfaceHash) public constant returns (address);
    function setInterfaceImplementer(address addr, bytes32 interfaceHash, address implementer) public;
}

contract ERC820Implementer {
    // the real address is 0xBe78655dfF872D22B95AE366Fb3477D977328Ade
    ERC820Registry erc820Registry = ERC820Registry(0xf38062f6deaa6fa7410bf6a661850b82c3d55361);

    function setInterfaceImplementation(string interfaceLabel, address implementation) internal {
        bytes32 interfaceHash = keccak256(bytes(interfaceLabel));
        erc820Registry.setInterfaceImplementer(this, interfaceHash, implementation);
    }

    function interfaceAddr(address addr, string interfaceLabel) internal constant returns(address) {
        bytes32 interfaceHash = keccak256(bytes(interfaceLabel));
        return erc820Registry.getInterfaceImplementer(addr, interfaceHash);
    }

    function delegateManagement(address newManager) internal {
        erc820Registry.setManager(this, newManager);
    }
}
