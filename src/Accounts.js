import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Association from './Association'

class Accounts extends Component{
  render(){
    return (
        <Router>
          <div>
            <ul>
              <li>
                <Link to='/Association'>Administrator</Link>
              </li>
              <li>
                <Link to='/Vote'>User1</Link>
              </li>
            </ul>
            <hr />
            <Route path="/Association" component={Association} />
          </div>
        </Router>
        );
  }
}

export default Accounts;