// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

struct Profile {
    uint id;
    bytes32 firstName;
    bytes32 lastName;
    bytes32 email;
    bytes32 contact;
    bool exists;
    //bytes32 dp;
}
