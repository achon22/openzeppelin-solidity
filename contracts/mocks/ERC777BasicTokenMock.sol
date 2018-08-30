pragma solidity ^0.4.24;

import "../proposals/ERC777/ERC777BasicToken.sol";

contract ERC777BasicTokenMock is ERC777BasicToken {
  constructor(
    string _name,
    string _symbol,
    uint256 _granularity
  )
    ERC777BasicToken(_name, _symbol, _granularity)
    public
  {}
}
