// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '../StructDeclaration.sol';

contract UserStorage {

    address private ownerAddress; address private controllerAddress;

    constructor() {
        ownerAddress = msg.sender;
    }

    modifier isOwner() {
        require(msg.sender == ownerAddress, "Contract is not called by owner");
        _;
    }

    modifier isController() {
        require(msg.sender == controllerAddress);
        _;
    }

    function setControllerAddress(address _controllerAddress) public isOwner {
        controllerAddress = _controllerAddress;
    }

    mapping(address => bytes32) internal userCnic;

    mapping(bytes32 => Profile) internal profiles;

    uint internal latestUserId = 0; uint internal latestCnic = 0;

    bytes32[] internal cnicList;

    modifier checkCNIC(bytes32 _cnic) {
        bool isExist = false;
        for(uint i=0; i<cnicList.length; i++) {
            if(_cnic == cnicList[i]) {
                isExist = true;
                break;
            }
        }
        require(!isExist, "CNIC already exists");
        _;
    }

    function registerCNIC(bytes32 _cnic, address _address) public checkCNIC(_cnic) isController {
        userCnic[_address] = _cnic;
        cnicList.push(_cnic);
        latestCnic++;
    }

    function createUser(bytes32 _firstname, bytes32 _lastname, bytes32 _email, bytes32 _contact, address _address) public isController {
        latestUserId++;
        profiles[userCnic[_address]] = Profile(latestUserId, _firstname, _lastname, _email, _contact, true);
    }

    function getCnicByAddress(address _address) public view isController returns(bytes32) {
        return userCnic[_address];
    }

    function getUserProfileByAddress(address _address) public view isController returns(Profile memory) {
        return profiles[userCnic[_address]];
    }

    function getCnicList() public view isController returns(bytes32[] memory) {
        return cnicList;
    }

    function updateCNIC(bytes32 _newCnic, address _address) public isController {
        bytes32 oldCnic = userCnic[_address];
        userCnic[_address] = _newCnic;
        if(profiles[oldCnic].exists == true) {
            profiles[_newCnic] = profiles[oldCnic];
            delete profiles[oldCnic];
        }
    }

}


//const instance = await UserStorage.deployed()
//const address = await web3.eth.getAccounts()
//instance.registerCNIC(web3.utils.asciiToHex('9040301451661'), address[0])
//instance.getCnicByAddress(address[0])
//instance.createUser(web3.utils.asciiToHex('Talal'), web3.utils.asciiToHex('Farrukh'), web3.utils.asciiToHex('tf@gmail.com'), web3.utils.asciiToHex('03035550307'), address[0])
//instance.getUserProfileByAddress(address[0])
//instance.getCnicList()
