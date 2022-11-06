// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/ISplitable.sol';

import './Splitable.sol';

contract SplitableFactory is Ownable {
    address public immutable nounsDAOLogic;
    address public immutable nounsToken;

    event SplitableCreated(address indexed splitable, address indexed owner);

    constructor(address _nounsDAOLogic, address _nounsToken) {
        nounsDAOLogic = _nounsDAOLogic;
        nounsToken = _nounsToken;
    }

    function createSplitable() external returns (address splitable) {
        splitable = address(new Splitable(nounsDAOLogic, nounsToken));
        ISplitable(splitable).initialize(msg.sender);
        emit SplitableCreated(splitable, msg.sender);
    }
}
