import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

//import firebase from 'firebase';
import axios from 'axios';

var firebase = require('firebase');
var algoliasearch = require('algoliasearch');
//var client = algoliasearch('HQWHB4S3S1', '5d431ceafb5437b0e6104f52efebd577');
var client = algoliasearch('FBABZ8SPVB',   'afd643cfb28c1a5393e676c86a65b25d');
var index = client.initIndex('funtionTests');

//-----------
class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      searchResults : []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAlgolria = this.handleAlgolria.bind(this);
    this.initIndex = this.initIndex.bind(this);
    //this.addOrUpdateObject = this.addOrUpdateObject.bind(this);
  }
  componentWillMount(){
    var config = {
//      apiKey: "AIzaSyBBGzkWSAIhig6pOM71jipP6lAywRE2jcM",
      apiKey: "AIzaSyBBGzkWSAIhig6pOM71jipP6lAywRE2jcM",
      authDomain: "fir-rrendering.firebaseapp.com",
      databaseURL: "https://fir-rrendering.firebaseio.com",
      projectId: "fir-rrendering",
      storageBucket: "fir-rrendering.appspot.com",
      messagingSenderId: "101253143540"
  };
    firebase.initializeApp(config);

    this.handleAlgolria();
  }
  handleAlgolria(){
    //var client = algoliasearch('YourApplicationID', 'YourAPIKey');
 
    // Connect to our firebase contacts data
    //var fb = new firebase('https://fir-rrendering.firebaseio.com/lessons');

    // Get all data from firebase
    //fb.on('Eng', this.initIndex());
    var _this = this;
    var starCountRef = firebase.database().ref('funtionTest/');
    
    starCountRef.on('value', function(dataSnapshot){
      //_this.initIndex(dataSnapshot);
      //_this.reindexIndex(dataSnapshot);
    });
    // Listen for changes to Firebase data
    // starCountRef.on('child_added', function(dataSnapshot){
    //   _this.addOrUpdateObject(dataSnapshot);
    // });
    // starCountRef.on('child_changed', function(dataSnapshot){
    //   _this.addOrUpdateObject(dataSnapshot);
    // });
    starCountRef.on('child_removed', function(dataSnapshot){
      _this.removeIndex(dataSnapshot);
    });
    

  }

  initIndex(dataSnapshot){
    console.log("~~~~Here is initIndex function");
    // Array of data to index
    var objectsToIndex = [];

    // Get all objects
    var values = dataSnapshot.val();
      console.log("values", values);
    // Process each Firebase ojbect
    for (var key in values) {
      if (values.hasOwnProperty(key)) {
        // Get current Firebase object
        var firebaseObject = values[key];

        // Specify Algolia's objectID using the Firebase object key
        firebaseObject.objectID = key;

        // Add object for indexing
        objectsToIndex.push(firebaseObject);
      }
    }
    console.log("objectsToIndex", objectsToIndex);
    // Add or update new objects
    index.saveObjects(objectsToIndex, function(err, content) {
      if (err) {
        throw err;
      }
      console.log('firebase<>Algolia import done');
    });
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
    
    //axios.get('https://us-central1-fir-rrendering.cloudfunctions.net/requestTest', {
    //axios.get('https://us-central1-hoops-21a72.cloudfunctions.net/searchQuery', {
    axios.get('https://us-central1-hoops-21a72.cloudfunctions.net/searchQuery', {
        params: {
          searchkey: event.target.value
        }
      })
      .then(function (response) {
        console.log("-----------",response);
        //this.setState({searchResults : response.})

      })
      .catch(function (error) {
        console.log(error);
    });
      console.log("index", index);
      index.search(event.target.value, function(err, content){
        console.log(content.hits);
        _this.setState({searchResults : content.hits});
      });

// Make a request for a user with a given ID 
// axios.get('http://api.wunderground.com/api/aa6387cc7fafc58d/conditions/q/CA/San_Francisco.json')
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });
 


      
  }
// Reindex Data
  reindexIndex(dataSnapshot){
    console.log("~~~~Here is reIndex function");
    var objectsToIndex = [];
    // Create a temp index
    var tempIndexName = 'funtionTests';
    var tempIndex = client.initIndex(tempIndexName);

    // Get all objects
    var values = dataSnapshot.val();

    // Process each Firebase object
    for (var key in values) {
      if (values.hasOwnProperty(key)) {
        // Get current Firebase object
        var firebaseObject = values[key];

        // Specify Algolia's objectID using the Firebase object key
        firebaseObject.objectID = key;

        // Add object for indexing
        objectsToIndex.push(firebaseObject);
      }
    }

    // Add or update new objects
    index.saveObjects(objectsToIndex, function(err, content) {
      if (err) {
        throw err;
      }

      // Overwrite main index with temp index
      client.moveIndex(tempIndexName, 'contacts', function(err, content) {
        if (err) {
          throw err;
        }

        console.log('Firebase<>Algolia reimport done');
      });
    });
  }
  

  addOrUpdateObject(dataSnapshot) {
    console.log("__addOrUpdateObject function");
    console.log("datasnapshot", dataSnapshot);
    // Get Firebase object
    var firebaseObject = dataSnapshot.val();

    // Specify Algolia's objectID using the Firebase object key
    
    //firebaseObject.objectID = dataSnapshot.key();
    console.log(dataSnapshot.key);
    firebaseObject.objectID = dataSnapshot.key;

    // Add or update object
    index.saveObject(firebaseObject, function(err, content) {
      if (err) {
        throw err;
      }

      console.log('Firebase<>Algolia object saved');
    });
  }
  removeIndex(dataSnapshot) {
    console.log("datasnapshot", dataSnapshot);
    // Get Algolia's objectID from the Firebase object key
    var objectID = dataSnapshot.key;

    // Remove the object from Algolia
    index.deleteObject(objectID, function(err, content) {
      if (err) {
        throw err;
      }

      console.log('Firebase<>Algolia object deleted');
    });
  }
  showSearchResults = () =>{
    return(
      this.state.searchResults.map((element)=>{
        //console.log(element.address, "~~~~")
        <p>{element.address}</p>
      })
      
    )
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
      
        {
          this.showSearchResults()
        }
        
      </div>
    );
  }
}

export default App;
