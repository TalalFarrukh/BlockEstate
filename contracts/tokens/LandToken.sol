// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "../Utils.sol";

contract LandToken is ERC721, ERC721URIStorage, ERC721Burnable, Ownable, Utils {

    struct TokenOwnerStruct {
        uint256 tokenId;
        bool isShared;
        address[] sharedOwners;
    }
    mapping(bytes32 => TokenOwnerStruct) TokenOwner;

    struct TokenSharedOwnerStruct {
        uint256 tokenId;
        bool isSharing;
        address originalOwner;
    }
    mapping(bytes32 => TokenSharedOwnerStruct) TokenSharedOwner;

    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("LandToken", "LTT") {}

    function safeMint(address to, string memory uri) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();  _safeMint(to, tokenId);  _setTokenURI(tokenId, uri);
        
        address[] memory emptyArray;
        bytes32 ownerToken = hashTokenAddress(to,tokenId);
        TokenOwner[ownerToken] = TokenOwnerStruct(tokenId,false,emptyArray);
    }

    function safeMint(address to, string memory uri, address[] memory sharedOwners) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();  _safeMint(to, tokenId);  _setTokenURI(tokenId, uri);

        bytes32 ownerToken = hashTokenAddress(to,tokenId);
        TokenOwner[ownerToken] = TokenOwnerStruct(tokenId,true,sharedOwners);

        for(uint i=0; i<sharedOwners.length; i++) {
            bytes32 sharedToken = hashTokenAddress(sharedOwners[i],tokenId);
            TokenSharedOwner[sharedToken] = TokenSharedOwnerStruct(tokenId,true,to);
        }
    }

    function sharedTokenOwner(address sharedOwner, uint256 tokenId) public view returns(TokenSharedOwnerStruct memory) {
        bytes32 ownerToken = hashTokenAddress(sharedOwner,tokenId);
        return TokenSharedOwner[ownerToken];
    }

    function sharedOwnerList(address owner, uint256 tokenId) public view returns(address[] memory) {
        bytes32 ownerToken = hashTokenAddress(owner,tokenId);
        return TokenOwner[ownerToken].sharedOwners;
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        address owner = ownerOf(tokenId);
        bytes32 ownerToken = hashTokenAddress(owner,tokenId);
        address[] memory sharedOwners = TokenOwner[ownerToken].sharedOwners;

        for(uint i=0; i<sharedOwners.length; i++) {
            bytes32 sharedToken = hashTokenAddress(sharedOwners[i],tokenId);
            TokenSharedOwner[sharedToken] = TokenSharedOwnerStruct(696969696,false,address(0));
        }

        address[] memory emptyArray;
        TokenOwner[ownerToken] = TokenOwnerStruct(6969696969696,false,emptyArray);

        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function setSharedOwners(address owner, address[] memory sharedOwners, uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        
        bytes32 ownerToken = hashTokenAddress(owner,tokenId);

        for(uint i=0; i<sharedOwners.length; i++) {
            bytes32 sharedToken = hashTokenAddress(sharedOwners[i],tokenId);
            TokenOwner[ownerToken].sharedOwners.push(sharedOwners[i]);
            TokenSharedOwner[sharedToken] = TokenSharedOwnerStruct(tokenId,true,owner);
        }
    }

    function transferFrom(address from, address to, uint256 tokenId) public override {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _transfer(from, to, tokenId);

        bytes32 ownerToken = hashTokenAddress(from,tokenId);
        address[] memory sharedOwners = TokenOwner[ownerToken].sharedOwners;

        for(uint i=0; i<sharedOwners.length; i++) {
            bytes32 sharedToken = hashTokenAddress(sharedOwners[i],tokenId);
            TokenSharedOwner[sharedToken] = TokenSharedOwnerStruct(696969696,false,address(0));
        }

        address[] memory emptyArray;
        TokenOwner[ownerToken] = TokenOwnerStruct(6969696969696,false,emptyArray);

        bytes32 newOwnerToken = hashTokenAddress(to,tokenId);
        TokenOwner[newOwnerToken] = TokenOwnerStruct(tokenId,false,emptyArray);
    }

    function transferFrom(address from, address to, uint256 tokenId, address[] memory _sharedOwners) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _transfer(from, to, tokenId);

        bytes32 ownerToken = hashTokenAddress(from,tokenId);
        address[] memory sharedOwners = TokenOwner[ownerToken].sharedOwners;

        for(uint i=0; i<sharedOwners.length; i++) {
            bytes32 sharedToken = hashTokenAddress(sharedOwners[i],tokenId);
            TokenSharedOwner[sharedToken] = TokenSharedOwnerStruct(696969696,false,address(0));
        }

        address[] memory emptyArray;
        TokenOwner[ownerToken] = TokenOwnerStruct(6969696969696,false,emptyArray);

        bytes32 newOwnerToken = hashTokenAddress(to,tokenId);
        TokenOwner[newOwnerToken] = TokenOwnerStruct(tokenId,true,_sharedOwners);

        for(uint i=0; i<_sharedOwners.length; i++) {
            bytes32 newSharedToken = hashTokenAddress(_sharedOwners[i],tokenId);
            TokenSharedOwner[newSharedToken] = TokenSharedOwnerStruct(tokenId,true,to);
        }
    }
    
}
