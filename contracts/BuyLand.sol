// contracts/Izendome.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IzenDome.sol";

contract Buyland is IzenDome {
    address [800] public owners;
    uint [800] _price;
    
    event LandBought(address indexedFrom, uint256 landId, address owner);
    event LandTransfer(address from, address to, uint landId);
    event PriceChanged(uint landId, uint256 newPrice);

    function buy(uint256 landId, uint256 price) public payable returns (uint256) {
        require(landId >= 0 && landId <= 799);
        require(owners[landId] == 0x0000000000000000000000000000000000000000);
        _price[landId] = price;
        _mint(msg.sender, landId);
        owners[landId] = msg.sender;
        emit LandBought(msg.sender, landId, owners[landId]);
        return landId;
    }
    // Retrieving the owners
    function getOwners() public view returns (address[800] memory) {
        return owners;
    }
    // Retrieving specific owner
    function getOwner(uint256 landId) public view returns (address landOwner) {
        return owners[landId];
    }
    function transferLand(address payable from, address payable to, uint256 landId ) public virtual  returns (uint256) {
        //solhint-disable-next-line max-line-length
        _transfer(from, to, landId);
        owners[landId] = to;
        emit LandTransfer(from ,to ,landId);
        return landId;
    }
    function setPrice(uint256 landId, uint256 newPrice) public virtual {
        require(ownerOf(landId) == msg.sender);
        _price[landId] = newPrice;
        emit PriceChanged(landId, newPrice);
    }
    function getPrice(uint256 landId) public view returns (uint256) {
        return _price[landId];
    }

}