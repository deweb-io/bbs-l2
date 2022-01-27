// SPDX-License-Identifier: MIT
pragma solidity 0.7.6;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/drafts/ERC20Permit.sol";

contract BBSTokenL1 is ERC20, ERC20Permit, Ownable {
  string public teststring;
  address public testaddress;

  constructor() ERC20("BBS", "BBS") ERC20Permit("BBS") {}

  function mint(address to, uint256 amount) public onlyOwner {
      _mint(to, amount);
  }

}
