pragma solidity ^0.6.0;

/*
POB contract handles all the proof of burn related functionality
*/
contract POB {
    address public coordinator;

    constructor() public {
        coordinator = msg.sender;
    }

    function getCoordinator() public view returns (address) {
        return coordinator;
    }
}
