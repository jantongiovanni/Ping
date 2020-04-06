import firebase from 'firebase';
import 'firebase/firestore';

import {
    API_KEY,
    AUTH_DOMAIN,
    DATABASE_URL,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGE_SENDER_ID,
    APP_ID
} from 'react-native-dotenv'

class Fire {
  constructor() {
    this.init();
    this.observeAuth();
  }


  init = () => {
    if(!firebase.apps.length) {
        firebase.initializeApp({
          apiKey: API_KEY,
          authDomain: AUTH_DOMAIN,
          databaseURL: DATABASE_URL,
          projectId: PROJECT_ID,
          storageBucket: STORAGE_BUCKET,
          messagingSenderId: MESSAGE_SENDER_ID,
          appId: APP_ID
        });
      }
    };


  observeAuth = () =>
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);

  onAuthStateChanged = user => {
    if (!user) {
      try {
        firebase.auth().signInAnonymously().then(function(result){
          console.log("-------------sign in anon: result--------------")
          console.log(result);
          if(result.additionalUserInfo.isNewUser){
            console.log("NEW USER");
            firebase.firestore().collection('users').doc(result.user.uid).set({
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

Fire.shared = new Fire();
export default Fire;
