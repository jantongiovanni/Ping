// import firebase from 'firebase';
// import 'firebase/firestore';
import {app, db} from './Fire';
import React from 'react';

class Auth {
  constructor() {
    console.log("observe auth const");
    this.observeAuth();
  }

  observeAuth = () =>
    app.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        app.auth().signInAnonymously().then(function(result){
          console.log("-------------sign in anon: result--------------")
          console.log(result);
          if(result.additionalUserInfo.isNewUser){
            console.log("NEW USER");
            db.collection('users').doc(result.user.uid).set({
              createdAt: Date.now()
            }).then(function(){
              console.log("User successfullly written to firestore");
            }).catch(function(error) {
              console.log("Error writing doc to firestore: ", error);
            });
          }
        });
      } catch ({ message }) {
        alert(message);
      }
    } else {
      console.log("user is signed in")
    }
  };
}

console.log("Auth");
Auth.shared = new Auth();
export default Auth;
