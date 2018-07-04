pragma solidity ^0.4.16;

import "./Token.sol";

contract TokenRecipient {
    event receivedTokens(address _from, uint256 _value, address _token, bytes _extraData);
    event receivedEther(address sender, uint amount);

    function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData) public {
        Token t = Token(_token);
        require(t.transferFrom(_from, this, _value));
        //emit an event
        emit receivedTokens(_from, _value, _token, _extraData);
    }

    function() payable public {
        emit receivedEther(msg.sender, msg.value);
    }
}