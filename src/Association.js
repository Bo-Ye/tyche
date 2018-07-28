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
      minutesForDebate: 0,
      proposals: [],
      minimumSharesToPassAVoteInput: '',
      minutesForDebateInput: '',
      newProposal: ''
    };

    this.handleMinimumSharesToPassAVoteInputChange = this.handleMinimumSharesToPassAVoteInputChange.bind(this);
    this.handleMinutesForDebateInputChange = this.handleMinutesForDebateInputChange.bind(this);
    this.handleChangeVotingRulesSubmit = this.handleChangeVotingRulesSubmit.bind(this);
    this.handleCreateAProposalSubmit = this.handleCreateAProposalSubmit.bind(this);
    this.handleNewProposalChange = this.handleNewProposalChange.bind(this);
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
    const Association = contract(AssociationContract);
    Association.setProvider(this.web3.currentProvider);
    Association.deployed().then(instance => this.association = instance).then(() => {
        this.setVotingRulesState();
        this.setProposalsState();
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

  setProposalsState(){
      var proposals = [];
      var proposalPromises = [];
      this.association.numProposals().then(numProposals => {
         for(var i = 0; i < numProposals; i++){
            var proposalPromise = this.association.proposals(i).then( proposal => proposals.push(proposal[2]));
            proposalPromises.push(proposalPromise);
         }
         Promise.all(proposalPromises).then( () => {
            this.setState({
                proposals: proposals
            });
         });
      });
  }

  handleMinimumSharesToPassAVoteInputChange(event) {
      this.setState({minimumSharesToPassAVoteInput: event.target.value});
  }

  handleMinutesForDebateInputChange(event) {
      this.setState({minutesForDebateInput: event.target.value});
  }

  handleNewProposalChange(event) {
      this.setState({newProposal: event.target.value});
  }

  handleChangeVotingRulesSubmit(event) {
    this.association.changeVotingRules(this.sharesAddress, this.state.minimumSharesToPassAVoteInput, this.state.minutesForDebateInput, {from: this.administrator}).then(() => {
       this.setVotingRulesState();
       this.setState({
               minimumSharesToPassAVoteInput: '',
               minutesForDebateInput: ''
       });
    });
    event.preventDefault();  //to prevent submit event from navigating to another page
  }

  handleCreateAProposalSubmit(event) {
      this.association.newProposal(0, 0, this.state.newProposal, 0, {from: this.administrator,  gas:3000000}).then(() => {
         this.setProposalsState();
         this.setState({
            newProposal: ''
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
    var proposalStyle = {
        verticalAlign: 'middle'
    };
    var trProposals = [];
    for (var i = 0; i < this.state.proposals.length; i++) {
            trProposals.push(<tr key={i}>
                                <td>{this.state.proposals[i]}</td>
                                <td></td>
                                <td></td>
                             </tr>);
    }
    return (
      <div >
        <div>
            <p>Administrator&#39;s current token balance: {this.state.balance}</p>
        </div>
        <div>
            <fieldset>
                <legend>Association:</legend>
                <div>
                    <h5>Voting Rules</h5>
                    <p>Minimum shares to pass a vote: {this.state.minimumSharesToPassAVote}, minutes for debate: {this.state.minutesForDebate}</p>
                </div>
                <div>
                    <h6>Proposals</h6>
                    <table>
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Voted</th>
                                <th>Time to expire</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trProposals}
                        </tbody>
                    </table>
                </div>
            </fieldset>
        </div>
        <div>
            <form onSubmit={this.handleChangeVotingRulesSubmit}>
                <div>
                    <h3>Change Voting Rules</h3>
                </div>
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
            <form onSubmit={this.handleCreateAProposalSubmit}>
                <div>
                    <h3>Create a proposal</h3>
                </div>
                <div >
                    <label style={proposalStyle}>Proposal: </label>
                    <textarea rows="4" cols="57" style={proposalStyle} value={this.state.newProposal} onChange={this.handleNewProposalChange}></textarea>
                </div>
                <div style={divSubmit}>
                    <input type="submit" style={inputSubmit}  value="Submit"/>
                </div>
            </form>
        </div>
      </div>
    );
  }
}

export default Association;