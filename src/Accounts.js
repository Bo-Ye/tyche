import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Association from './Association'
import User from './User'

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
                    <Link to='/user/1' style={linkStyle}>User1</Link>
                    <Link to='/user/2' style={linkStyle}>User2</Link>
                    <Link to='/user/3' style={linkStyle}>User3</Link>
                    <Link to='/user/4' style={linkStyle}>User4</Link>
                    <Link to='/user/5' style={linkStyle}>User5</Link>
                    <Link to='/user/6' style={linkStyle}>User6</Link>
                    <Link to='/user/7' style={linkStyle}>User7</Link>
                    <Link to='/user/8' style={linkStyle}>User8</Link>
                    <Link to='/user/9' style={linkStyle}>User9</Link>
                </div>
                <hr />
                <Route path="/Association" component={Association} />
                <Route path="/user/:userId" component={User} />
            </div>
        </Router>
        );
  }
}

export default Accounts;