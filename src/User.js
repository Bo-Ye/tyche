import React, { Component} from "react";
import Web3 from "web3";
import AdvancedTokenContract from '../build/contracts/AdvancedToken.json'
import AssociationContract from '../build/contracts/Association.json'

class User extends Component{
  constructor(props) {
    super(props);
    this.userId = this.props.match.params.userId;
    this.state = {
      balance: 0,
      minimumSharesToPassAVote: 0,
      minutesForDebate: 0
    };
  }

  componentWillMount() {
    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    this.web3 = new Web3(provider);
    var user = this.web3.eth.accounts[this.userId];
    const contract = require('truffle-contract');
    //AdvancedToken contract
    const AdvancedToken = contract(AdvancedTokenContract);
    AdvancedToken.setProvider(this.web3.currentProvider);
    AdvancedToken.deployed().then(instance => {
        return instance.balanceOf(user);
    }).then(balance => {
      this.setState({
        balance: balance.toNumber()
      });
    });
    //Association contract
    const Association = contract(AssociationContract);
    Association.setProvider(this.web3.currentProvider);
    Association.deployed().then(instance => this.association = instance).then(() => {
        this.setVotingRulesState();
    });
  }

  setVotingRulesState(){
      this.association.minimumQuorum().then(minimumSharesToPassAVote => {
         this.setState({
              minimumSharesToPassAVote: minimumSharesToPassAVote.toNumber()
         });
      });
      this.association.debatingPeriodInMinutes().then(minutesForDebate => {
         this.setState({
              minutesForDebate: minutesForDebate.toNumber()
         });
      });
  }

  render(){
    var divSubmit = {
      width: 500,
      overflow: 'hidden'
    };
    var inputSubmit = {
          float: 'right'
        };
    return (
      <div >
        <div>User{this.userId}&#39;s current token balance: {this.state.balance}</div>
        <div>
            <fieldset>
                <legend>User:</legend>
                <div>
                    <h5>Voting Rules</h5>
                    <p>Minimum shares to pass a vote: {this.state.minimumSharesToPassAVote}, minutes for debate: {this.state.minutesForDebate}</p>
                </div>
                <div>
                    <h6>Proposals</h6>
                </div>
            </fieldset>
        </div>
        <div>
            <div>
                <h3>Create a proposal</h3>
            </div>
            <div>
                <label>Proposal: </label>
                <textarea rows="4" cols="57"></textarea>
            </div>
        </div>
      </div>
    );
  }
}

export default User;