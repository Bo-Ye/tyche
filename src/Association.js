import React, { Component} from "react";
import Web3 from "web3";
import AdvancedTokenContract from '../build/contracts/AdvancedToken.json'
import AssociationContract from '../build/contracts/Association.json'

class Association extends Component{
  constructor(props) {
    super(props);
    this.state = {
      balance: 0,
      minimumSharesToPassAVote: 0,
      minimumSharesToPassAVoteInput: '',
      minutesForDebate: 0,
      minutesForDebateInput: ''
    };

    this.handleMinimumSharesToPassAVoteInputChange = this.handleMinimumSharesToPassAVoteInputChange.bind(this);
    this.handleMinutesForDebateInputChange = this.handleMinutesForDebateInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    this.web3 = new Web3(provider);
    this.administrator = this.web3.eth.accounts[0];
    const contract = require('truffle-contract');
    //AdvancedToken contract
    const AdvancedToken = contract(AdvancedTokenContract);
    AdvancedToken.setProvider(this.web3.currentProvider);
    AdvancedToken.deployed().then(instance => {
        this.sharesAddress = instance.address;
        return instance.balanceOf(this.administrator);
    }).then(balance => {
      this.setState({
        balance: balance.toNumber()
      });
    });
    //Association contract
    Association = contract(AssociationContract);
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

   handleMinimumSharesToPassAVoteInputChange(event) {
      this.setState({minimumSharesToPassAVoteInput: event.target.value});
    }

   handleMinutesForDebateInputChange(event) {
      this.setState({minutesForDebateInput: event.target.value});
   }

  handleSubmit(event) {
    this.association.changeVotingRules(this.sharesAddress, this.state.minimumSharesToPassAVoteInput, this.state.minutesForDebateInput, {from: this.administrator}).then(() => {
       this.setVotingRulesState();
       this.setState({
               minimumSharesToPassAVoteInput: '',
               minutesForDebateInput: ''
       });
    });
    event.preventDefault();  //to prevent submit event from navigating to another page
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
        <div>Administrator&#39;s current token balance: {this.state.balance}</div>
        <div>
            <fieldset>
                <legend>Association:</legend>
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
            <form onSubmit={this.handleSubmit}>
                <h3>Change Voting Rules</h3>
                <div>
                    <label>Minimum shares to pass a vote: </label>
                    <input type="text" value={this.state.minimumSharesToPassAVoteInput} onChange={this.handleMinimumSharesToPassAVoteInputChange}/>
                </div>
                <div>
                    <label>Minutes for debate: </label>
                    <input type="text" value={this.state.minutesForDebateInput} onChange={this.handleMinutesForDebateInputChange}/>
                </div>
                <div style={divSubmit}>
                    <input type="submit" style={inputSubmit}  value="Submit"/>
                </div>
            </form>
        </div>
        <div>
            <h3>Create a proposal</h3>
            <div>
                <label>Proposal: </label>
                <textarea rows="4" cols="57"></textarea>
            </div>
        </div>
      </div>
    );
  }
}

export default Association;