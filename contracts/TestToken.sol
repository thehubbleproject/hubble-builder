pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title TestToken is a basic ERC20 Token
 */
contract TestToken is ERC20, Ownable {

    /**
     * @dev assign totalSupply to account creating this contract */
     constructor(uint256 initialSupply) public ERC20("TestToken", "TT") {
        _mint(msg.sender, initialSupply);
    }
}
