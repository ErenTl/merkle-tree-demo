// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract atokenBeacon is Ownable{

    UpgradeableBeacon immutable beacon;

    address public impl;

    constructor(address _impl) {
        beacon = new UpgradeableBeacon(_impl);
        impl = _impl;
        transferOwnership(tx.origin);
    }

    function update(address _newImpl) public onlyOwner {
        beacon.upgradeTo(_newImpl);
        impl = _newImpl;
    }

    function implementation() public view returns(address) {
        return beacon.implementation();
    }
}