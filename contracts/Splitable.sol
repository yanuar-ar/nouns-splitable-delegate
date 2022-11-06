// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import './interfaces/INounsToken.sol';
import './interfaces/INounsDAOLogic.sol';

contract Splitable is Ownable {
    error NotAuthorized();
    error Forbidden();

    address public factory;
    address public delegator;
    uint256[] public tokenIds;

    INounsDAOLogic public nounsDAOLogic;
    INounsToken public nounsToken;

    constructor(address _nounsDAOLogic, address _nounsToken) {
        factory = msg.sender;
        nounsDAOLogic = INounsDAOLogic(_nounsDAOLogic);
        nounsToken = INounsToken(_nounsToken);
    }

    function initialize(address _owner) external {
        if (msg.sender != factory) revert Forbidden();
        _transferOwnership(_owner);
    }

    function deposit(uint256[] memory _tokenIds) external onlyOwner {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            nounsToken.transferFrom(owner(), address(this), _tokenIds[i]);
            tokenIds.push(_tokenIds[i]);
        }
    }

    function withdraw() external onlyOwner {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            nounsToken.transferFrom(address(this), owner(), tokenIds[i]);
            delete tokenIds[i];
        }
    }

    function delegates(address _delegator) external {
        if (msg.sender != owner() || msg.sender != delegator) revert NotAuthorized();

        delegator = _delegator;
        nounsToken.delegates(_delegator);
    }

    function castVote(uint256 proposalId, uint8 support) external onlyOwner {
        nounsDAOLogic.castVote(proposalId, support);
    }

    function castVoteWithReason(
        uint256 proposalId,
        uint8 support,
        string calldata reason
    ) external onlyOwner {
        nounsDAOLogic.castVoteWithReason(proposalId, support, reason);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        string[] memory signatures,
        bytes[] memory calldatas,
        string memory description
    ) external onlyOwner {
        nounsDAOLogic.propose(targets, values, signatures, calldatas, description);
    }
}
