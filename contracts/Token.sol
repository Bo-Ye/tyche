pragma solidity ^0.4.16;

interface Token {
    function transferFrom(address _from, address _to, uint256 _value) external returns (bool success);
    function balanceOf(address _address) external returns (uint256 balance);
}