pragma solidity ^0.4.16;

import "./Owned.sol";
import "./TokenERC20.sol";

contract AdvancedToken is Owned, TokenERC20 {
    //member variables
    mapping(address => bool) public frozenAccount;
    uint256 public sellPrice;
    uint256 public buyPrice;
    //events
    event FrozenFunds(address target, bool frozen);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    constructor(string tokenName, string tokenSymbol, uint256 initialSupply) TokenERC20(tokenName, tokenSymbol, initialSupply) public {}

    /* Internal transfer, only can be called by this contract */
    function _transfer(address _from, address _to, uint _value) internal {
        //conditions check
        require(_to != 0x0);
        require(balanceOf[_from] >= _value);
        require(balanceOf[_to] + _value >= balanceOf[_to]);
        require(!frozenAccount[_from]);
        require(!frozenAccount[_to]);
        //transfer
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        // fires up an Transfer event
        emit Transfer(_from, _to, _value);
    }

    /**
     * Freeze or unfreeze target from sending & receiving tokens
     *
     *  @param target Address to be frozen
     *  @param freeze either to freeze it or not
     */
    function freezeAccount(address target, bool freeze) onlyOwner public {
        frozenAccount[target] = freeze;
        emit FrozenFunds(target, freeze);
    }

    /**
     *  Allow users to buy tokens for new buy price and sell tokens for new sell price
     *
     *  @param newSellPrice Price the users can sell to the contract
     *  @param newBuyPrice Price users can buy from the contract
     */
    function setPrices(uint256 newSellPrice, uint256 newBuyPrice) onlyOwner public {
        sellPrice = newSellPrice;
        buyPrice = newBuyPrice;
    }

    /**
     * Buy tokens from contract by sending ether
     */
    function buy() payable public {
        uint amount = msg.value / buyPrice;
        _transfer(this, msg.sender, amount);
    }

    /**
     * Sell some tokens to contract
     *
     * @param amount amount of tokens to be sold
     */
    function sell(uint256 amount) public {
        address tokenAddress = this;
        require(tokenAddress.balance >= amount * sellPrice);
        _transfer(msg.sender, this, amount);
        // sends ether to the seller. It's important to do this last to avoid recursion attacks
        msg.sender.transfer(amount * sellPrice);
    }

    /**
     *  Create `mintedAmount` tokens and send it to `target`
     *
     * @param target Address to receive the tokens
     * @param mintedAmount the amount of tokens it will receive
     */
    function mintToken(address target, uint256 mintedAmount) onlyOwner public {
        balanceOf[target] += mintedAmount;
        totalSupply += mintedAmount;
        //fire up events
        emit Transfer(0, this, mintedAmount);
        emit Transfer(this, target, mintedAmount);
    }
}