import React, { Component} from "react";
import Web3 from "web3";
import AdvancedTokenContract from '../build/contracts/AdvancedToken.json'

class Association extends Component{
  constructor(props) {
    super(props);
    this.state = {
      balance: 0
    };
  }

  componentWillMount() {
    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    var web3 = new Web3(provider);
    const contract = require('truffle-contract');
    const AdvancedToken = contract(AdvancedTokenContract);
    AdvancedToken.setProvider(web3.currentProvider);
    AdvancedToken.deployed().then(instance => instance.balanceOf(web3.eth.accounts[0])).then(balance => {
      this.setState({
        balance: balance.toNumber()
      });
    });
  }



  render(){
    var divSubmit = {
      width: 500,
      overflow: 'hidden'
    };
    var btnSubmit = {
          float: 'right'
        };
    return (
      <div >
        <div>Administrator's current token balance: {this.state.balance}</div>
        <div>Change Voting Rules</div>
        <div>
            <label>Minimum shares to pass a vote: </label>
            <input></input>
        </div>
        <div>
            <label>Minutes for debate: </label>
            <input></input>
        </div>
        <div style={divSubmit}>
            <button style={btnSubmit}>Submit</button>
        </div>
      </div>
    );
  }
}

export default Association;