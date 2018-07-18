import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Association from './Association'

class Accounts extends Component{
  render(){
    var linkStyle = {
        margin: 10
    };
    return (
        <Router>
            <div>
                <div>
                    <Link to='/Association'>Administrator</Link>
                </div>
                <div>
                    <Link to='/Vote' style={linkStyle}>User1</Link>
                    <Link to='/Vote' style={linkStyle}>User2</Link>
                    <Link to='/Vote' style={linkStyle}>User3</Link>
                    <Link to='/Vote' style={linkStyle}>User4</Link>
                    <Link to='/Vote' style={linkStyle}>User5</Link>
                </div>
                <hr />
                <Route path="/Association" component={Association} />
            </div>
        </Router>
        );
  }
}

export default Accounts;