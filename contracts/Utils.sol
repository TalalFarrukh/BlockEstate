// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Utils {

    function indexOfAddress(address checkAddress, address[] memory arrayAddress) public pure returns(bool) {
        bool x = false;

        for(uint i=0; i<arrayAddress.length; i++) {
            if(checkAddress == arrayAddress[i]) {
                x = true;
                break;
            }
        }
        return x;
    }

    function indexOfTokenId(uint256 checkTokenId, uint256[] memory arrayTokenId) public pure returns(bool) {
        bool x = false;

        for(uint i=0; i<arrayTokenId.length; i++) {
            if(checkTokenId == arrayTokenId[i]) {
                x = true;
                break;
            }
        }
        return x;
    }

    function hashTokenAddress(address _address, uint256 _tokenId) public pure returns(bytes32) {
        return keccak256(abi.encodePacked(_address, _tokenId));
    }

}