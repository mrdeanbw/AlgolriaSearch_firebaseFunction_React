import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from 'firebase';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      searchResults : ['a','b'],
    };

    this.handleChange = this.handleChange.bind(this);
    //this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentWillMount(){
    var config = {
      apiKey: "AIzaSyBBGzkWSAIhig6pOM71jipP6lAywRE2jcM",
      authDomain: "fir-rrendering.firebaseapp.com",
      databaseURL: "https://fir-rrendering.firebaseio.com",
      projectId: "fir-rrendering",
      storageBucket: "fir-rrendering.appspot.com",
      messagingSenderId: "101253143540"
  };
    firebase.initializeApp(config);
  }

  handleChange(event) {
    // https://us-central1-fir-rrendering.cloudfunctions.net/requestTest
    var _this = this;
    this.setState({value: event.target.value});
    console.log("___", event.target.value);

    // var starCountRef = firebase.database().ref('lessons/'  + 'Che');
    //   starCountRef.on('value', function(snapshot) {
    //   //updateStarCount(postElement, snapshot.val());
    //   console.log("123_", snapshot.val());
    //   console.log("this.state.searchResults", _this.state.searchResults);
    // });

    // Optionally the request above could also be done as 
    axios.get('https://us-central1-fir-rrendering.cloudfunctions.net/requestTest', {
        params: {
          searchkey: event.target.value
        }
      })
      .then(function (response) {
        console.log("-----------",response);
      })
      .catch(function (error) {
        console.log(error);
    });
    
  }
  render() {
    var _this = this;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <input type="text" value={this.state.value} onChange={this.handleChange} />
        <div>
          {
            _this.state.searchResults.map((element, index) =>{
              <div>{element}</div>
            })
          }
        </div>
        
      </div>
    );
  }
}

export default App;
