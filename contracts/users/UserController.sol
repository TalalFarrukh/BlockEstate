// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './UserStorage.sol';
import '../StructDeclaration.sol';

contract UserController {

    UserStorage public UserStorageContract;

    constructor(UserStorage _UserStorageContract) {
        UserStorageContract = _UserStorageContract;
    }

    function getContractAddress() public view returns(UserStorage) {
        return UserStorageContract;
    }

    function registerCnic(bytes32 _cnic) public {
        UserStorageContract.registerCNIC(_cnic, msg.sender);
    }

    function getCnicByAddress() public view returns(bytes32) {
        return UserStorageContract.getCnicByAddress(msg.sender);
    }

    function createUser(bytes32 _firstname, bytes32 _lastname, bytes32 _email, bytes32 _contact) public {
        UserStorageContract.createUser(_firstname, _lastname, _email, _contact, msg.sender);
    }

    function getUserProfileByAddress() public view returns(Profile memory) {
        return UserStorageContract.getUserProfileByAddress(msg.sender);
    }

}