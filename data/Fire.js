import firebase from 'firebase'; // 4.8.1
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
            firebase.firestore().collection('users').doc(result.user.uid);
          }
        });
      } catch ({ message }) {
        alert(message);
      }
    } else {
      console.log("a user is signed in already")
    }
  };
}

Fire.shared = new Fire();
export default Fire;
