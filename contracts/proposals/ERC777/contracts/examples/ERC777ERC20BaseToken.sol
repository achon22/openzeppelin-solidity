pragma solidity 0.4.24;


import { ERC20Token } from "./ERC20Token.sol";
import { ERC777BasicToken } from "../ERC777BasicToken.sol";


contract ERC777ERC20BaseToken is ERC20Token, ERC777BasicToken {
    bool internal isErc20compatible;

    mapping(address => mapping(address => bool)) internal isAuthorized;
    mapping(address => mapping(address => uint256)) internal authorizedAmount;

    constructor(
        string _name,
        string _symbol,
        uint256 _granularity
    )
        internal ERC777BasicToken(_name, _symbol, _granularity)
    {
        isErc20compatible = true;
        setInterfaceImplementation("ERC20Token", this);
    }

    /// @dev This modifier is applied to erc20 obsolete methods that are
    ///  implemented only to maintain backwards compatibility. When the erc20
    ///  compatibility is disabled, this methods will fail.
    modifier erc20 () {
        require(isErc20compatible);
        _;
    }

    /// @dev For Backwards compatibility
    /// @return The decimls of the token. Forced to 18 in ERC777.
    function decimals() public erc20 constant returns (uint8) { return uint8(18); }

    /// @dev ERC20 backwards compatible transfer.
    /// @param _to The address of the recipient
    /// @param _amount The number of tokens to be transferred
    /// @return `true`, if the transfer can't be done, it should fail.
    function transfer(address _to, uint256 _amount) public erc20 returns (bool success) {
        sendTokens(msg.sender, _to, _amount, "", msg.sender, "", false);
        return true;
    }

    /// @dev ERC20 backwards compatible transferFrom.
    /// @param _from The address holding the tokens being transferred
    /// @param _to The address of the recipient
    /// @param _amount The number of tokens to be transferred
    /// @return `true`, if the transfer can't be done, it should fail.
    function transferFrom(address _from, address _to, uint256 _amount) public erc20 returns (bool success) {
        require(_amount <= authorizedAmount[_from][msg.sender]);

        // Cannot be after sendTokens because of tokensReceived re-entry
        authorizedAmount[_from][msg.sender] = authorizedAmount[_from][msg.sender].sub(_amount);
        sendTokens(_from, _to, _amount, "", msg.sender, "", false);
        return true;
    }

    /// @dev ERC20 backwards compatible approve.
    ///  `msg.sender` approves `_spender` to spend `_amount` tokens on its behalf.
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _amount The number of tokens to be approved for transfer
    /// @return `true`, if the approve can't be done, it should fail.
    function approve(address _spender, uint256 _amount) public erc20 returns (bool success) {
        authorizedAmount[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    /// @dev ERC20 backwards compatible allowance.
    ///  This function makes it easy to read the `allowed[]` map
    /// @param _owner The address of the account that owns the token
    /// @param _spender The address of the account able to transfer the tokens
    /// @return Amount of remaining tokens of _owner that _spender is allowed
    ///  to spend
    function allowance(address _owner, address _spender) public erc20 constant returns (uint256 remaining) {
        return authorizedAmount[_owner][_spender];
    }
}
