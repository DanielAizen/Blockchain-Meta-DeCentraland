// contracts/Izendome.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract IzenDome is ERC721 {

    constructor() ERC721("IzenDome", "IZD") {
    }
}