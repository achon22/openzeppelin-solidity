pragma solidity ^0.4.24;

contract ERC777Token {
    function name() external view returns (string);
    function symbol() external view returns (string);
    function totalSupply() external view returns (uint256);
    function balanceOf(address owner) public view returns (uint256);
    function granularity() external view returns (uint256);

    function defaultOperators() external view returns (address[]);
    function authorizeOperator(address operator) external;
    function revokeOperator(address operator) external;
    function isOperatorFor(address operator, address tokenHolder) public view returns (bool);

    function send(address to, uint256 amount, bytes data) external;
    function operatorSend(address from, address to, uint256 amount, bytes data, bytes operatorData) external;

    function burn(address _tokenHolder, uint256 _amount, bytes _userData, bytes _operatorData) external;
//    function operatorBurn(address from, uint256 amount, bytes data, bytes operatorData) external;

    event Sent(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 amount,
        bytes data,
        bytes operatorData
    );
    event Minted(address indexed operator, address indexed to, uint256 amount, bytes data, bytes operatorData);
    event Burned(address indexed operator, address indexed from, uint256 amount, bytes operatorData);
    event AuthorizedOperator(address indexed operator, address indexed tokenHolder);
    event RevokedOperator(address indexed operator, address indexed tokenHolder);
}

