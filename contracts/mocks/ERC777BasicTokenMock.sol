pragma solidity ^0.4.24;

import "../proposals/ERC777/ERC777BasicToken.sol";
import "../ownership/Ownable.sol";

contract ERC777BasicTokenMock is ERC777BasicToken {
  constructor(
    string _name,
    string _symbol,
    uint256 _granularity,
    address[] _defaultOperators
  )
    ERC777BasicToken(_name, _symbol, _granularity, _defaultOperators)
    public
  {}
}
