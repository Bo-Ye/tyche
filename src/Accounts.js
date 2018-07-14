import React, { Component} from "react";
import Web3 from "web3";
import AssociationContract from '../build/contracts/Association.json'

export class Accounts extends Component{
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    var provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
    var web3 = new Web3(provider);
    web3.eth.defaultAccount = web3.eth.accounts[0]
  }



  render(){
    return (
      <div>
        <div><a href="#">Administrator</a></div>
        <div><a href="#">User1</a></div>
      </div>
    );
  }
}

export default Accounts;