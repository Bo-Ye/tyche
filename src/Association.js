import React, { Component} from "react";
import Web3 from "web3";
import AssociationContract from '../build/contracts/Association.json'

class Association extends Component{
  constructor(props) {
    super(props)

    this.state = {
      minimumQuorum: 0
    }
  }

  componentWillMount() {
    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    var web3 = new Web3(provider);
    const contract = require('truffle-contract');
    const assocation = contract(AssociationContract);
    assocation.setProvider(web3.currentProvider);
    assocation.deployed().then((instance) => {
      return instance.minimumQuorum.call();
    }).then((result) =>{
      return this.setState({ minimumQuorum: result.valueOf() });
    });
  }



  render(){
    var floatRight = {
      float: 'right'
    };
    return (
      <div >
        <div>Change Voting Rules</div>
        <div>
            <label>Minimum shares to pass a vote: </label>
            <input></input>
        </div>
        <div>
            <label>Minutes for debate: </label>
            <input></input>
        </div>
        <div style={floatRight}>
            <button>Submit</button>
        </div>
      </div>
    );
  }
}

export default Association;