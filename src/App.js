import React, { Component} from "react";
import Web3 from "web3";
import AssociationContract from '../build/contracts/Association.json'
import "./App.css";

class App extends Component{
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
    return (
      <div className="App">
        <h1> Hello World! </h1>
        The minimum Quorum value is: {this.state.minimumQuorum}
      </div>
    );
  }
}

export default App;