//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MockUSDT is ERC20, Ownable {
    
    constructor() ERC20("Mock USDT", "USDT") Ownable(msg.sender) {
        _mint(msg.sender, 1000000 * 10**6); // 1M USDT with 6 decimals
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
    
    function faucet(uint256 amount) public {
        require(amount <= 10000 * 10**6, "Maximum 10,000 USDT per faucet call");
        _mint(msg.sender, amount);
    }
}
