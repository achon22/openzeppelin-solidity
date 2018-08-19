pragma solidity 0.4.24;

/// @title ERC777 ReferenceToken Contract
/// @dev This token contract's goal is to give an example implementation
///  of ERC777 with ERC20 compatiblity using the base ERC777 and ERC20
///  implementations provided with the erc777 package.
///  This contract does not define any standard, but can be taken as a reference
///  implementation in case of any ambiguity into the standard


import { ERC777ERC20BaseToken } from "./ERC777ERC20BaseToken.sol";
import { Ownable } from "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract ReferenceToken is ERC777ERC20BaseToken, Ownable {

    constructor(
        string _name,
        string _symbol,
        uint256 _granularity
    ) public ERC777ERC20BaseToken(_name, _symbol, _granularity) { // solhint-disable-line no-empty-blocks
        // insert custom constructor code
    }

    /// @dev Disables the ERC20 interface. This function can only be called
    ///  by the owner.
    function disableERC20() public onlyOwner {
        isErc20compatible = false;
        setInterfaceImplementation("ERC20Token", 0x0);
    }

    /// @dev Re enables the ERC20 interface. This function can only be called
    ///  by the owner.
    function enableERC20() public onlyOwner {
        isErc20compatible = true;
        setInterfaceImplementation("ERC20Token", this);
    }

    /* -- Mint And Burn Functions (not part of the ERC777 standard, only the Events/tokensReceived call are) -- */
    //
    /// @dev Generates `_amount` tokens to be assigned to `_tokenHolder`
    ///  Sample mint function to showcase the use of the `Minted` event and the logic to notify the recipient.
    /// @param _tokenHolder The address that will be assigned the new tokens
    /// @param _amount The quantity of tokens generated
    /// @param _operatorData Data that will be passed to the recipient as a first transfer
    function mint(address _tokenHolder, uint256 _amount, bytes _operatorData) public onlyOwner {
        requireMultiple(_amount);
        totalSupply_ = totalSupply_.add(_amount);
        tokenBalances[_tokenHolder] = tokenBalances[_tokenHolder].add(_amount);

        callRecipient(msg.sender, 0x0, _tokenHolder, _amount, "", _operatorData, true);

        emit Minted(msg.sender, _tokenHolder, _amount, "", _operatorData);
        if (isErc20compatible) {
            emit Transfer(0x0, _tokenHolder, _amount);
        }
    }

    /// @dev Burns `_amount` tokens from `_tokenHolder`
    ///  Sample burn function to showcase the use of the `Burned` event.
    /// @param _tokenHolder The address of the owner of the tokens
    /// @param _amount The quantity of tokens to burn
    function burn(address _tokenHolder, uint256 _amount, bytes _userData, bytes _operatorData) public {
        requireMultiple(_amount);
        require(balanceOf(_tokenHolder) >= _amount);
        callSender(msg.sender, _tokenHolder, 0x0, _amount, _userData, _operatorData);
        tokenBalances[_tokenHolder] = tokenBalances[_tokenHolder].sub(_amount);
        totalSupply_ = totalSupply_.sub(_amount);

        emit Burned(msg.sender, _tokenHolder, _amount, _operatorData);
        if (isErc20compatible) {
            emit Transfer(_tokenHolder, 0x0, _amount);
        }
    }
}
