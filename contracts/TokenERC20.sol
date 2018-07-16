pragma solidity ^0.4.16;

import "./TokenRecipient.sol";

contract TokenERC20 {
    // member variables
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;  ////// mapping key allows second-level mapping key to spend some tokens on behalf of mapping key, mapping key is real sender, second-level mapping key is representative.
    //events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);

    /**
     * Constructor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    constructor(string tokenName, string tokenSymbol, uint256 initialSupply) public {
        name = tokenName;
        symbol = tokenSymbol;
        totalSupply = initialSupply * 10 ** uint256(decimals);
        balanceOf[msg.sender] = totalSupply;
    }

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        //conditions check
        require(_to != 0x0);
        require(balanceOf[_from] >= _value);
        require(balanceOf[_to] + _value > balanceOf[_to]);
        //transfer
        uint previousBalances = balanceOf[_from] + balanceOf[_to];
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        assert(balanceOf[_from] + balanceOf[_to] == previousBalances);
        //fire up Transfer event
        emit Transfer(_from, _to, _value);
    }

    /**
     * Transfer tokens
     *
     * Send some tokens to an address from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer(address _to, uint256 _value) public returns (bool success) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    /**
     * Destroy tokens, remove some tokens from the system irreversibly
     *
     * @param _value the amount of money to burn
     */
    function burn(uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        totalSupply -= _value;
        // fire up a Burn event
        emit Burn(msg.sender, _value);
        return true;
    }

    /**
     * Set allowance for other address
     *
     * msg.sender allows spender to spend some tokens on msg.sender's behalf, msg.sender authorizes spender.
     *
     * @param _spender The address authorized to spend, _spender is representative.
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /**
     * Set allowance for other address and notify
     *
     * Allows spender contract to spend some tokens on your behalf, and then ping the contract about it and do
     * the transferring.
     *
     * @param _spender The address authorized to spend, it's contract address
     * @param _value the max amount they can spend
     * @param _extraData some extra information to send to the approved contract
     */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData) public returns (bool success) {
        TokenRecipient spender = TokenRecipient(_spender);
        if (approve(_spender, _value)) {
            spender.receiveApproval(this, msg.sender, _value, _extraData);
            return true;
        }
    }

    /**
     * Transfer tokens from other address, msg.sender is representative sender.
     *
     * Send some tokens to an to address on behalf of an from address
     *
     * @param _from The address of the sender, real sender
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        // Check allowance
        require(_value <= allowance[_from][msg.sender]);
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, _to, _value);
        return true;
    }

    /**
     * Destroy tokens from other account, remove some tokens from the system irreversibly on behalf of from address.
     *
     * @param _from the address of the sender
     * @param _value the amount of money to burn
     */
    function burnFrom(address _from, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        allowance[_from][msg.sender] -= _value;
        totalSupply -= _value;
        // fire up a Burn event
        emit Burn(_from, _value);
        return true;
    }
}



