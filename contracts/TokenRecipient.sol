pragma solidity ^0.4.16;

import "./Token.sol";

contract TokenRecipient {
    event receivedTokens(address _token, address _from, uint256 _value, bytes _extraData);
    event receivedEther(address sender, uint amount);
    /**
     * This TokenRecipient contract receives an approval and transfers some tokens to
     * itself on behalf of a from address
     *
     * @param _from the address sending tokens to this TokenRecipient contract
     * @param _value the amount of tokens
     * @param _token the token contract to transfer tokens
     * @param _extraData extra data
     *
     */
    function receiveApproval(address _token, address _from, uint256 _value, bytes _extraData) public {
        Token t = Token(_token);
        require(t.transferFrom(_from, this, _value));
        //fire up an event
        emit receivedTokens(_token, _from, _value, _extraData);
    }

    function() payable public {
        emit receivedEther(msg.sender, msg.value);
    }
}