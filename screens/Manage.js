import React, {Component} from 'react';
import {AsyncStorage, FlatList, TextInput, Text, View, StyleSheet, Dimensions} from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
import {app, db} from '../data/Fire';
import firebase from 'firebase';
//const { width: screenWidth } = Dimensions.get('window')

export default class Manage extends Component {
  constructor(props){
    super(props);

    var subscribe;

    this.state = {
      friendInput : 'A_TEST_ID',
      userToken: '',
      isDataFetched: false,
      itemArr: [],
      user: ''
    }
  }

  componentDidMount = () => {
    try {
      // Cloud Firestore: Initial Query
      console.log("Mount");
      this.retrieveData();
      console.log(this.getUserToken());
    }
    catch (error) {
      console.log("Mount Error: ", error);
    }
  };

  componentWillUnmount = () => {
    try {
      console.log("Unmount");
      this.subscribe();
    } catch (errror) {
      console.log("Unmount Error: ", error)
    }
  }

  handleFriendInputChange(friendInput){
    this.setState({friendInput});
  }

  retrieveData = async () => {
    console.log("Retrieving Data: Friends");
    try{
      this.state.user = firebase.auth().currentUser.uid;
      console.log("this.state.user: " + this.state.user);
      const roomsQuery = await db.collection("users").doc(this.state.user).collection('rooms');
      this.subscribe = await roomsQuery.onSnapshot( snapshot => {
        this.setState({ itemArr : snapshot.docs.map(document => document.data()), isDataFetched: true });
      });
      console.log(this.state.itemArr);
    }

    catch (error) {
      console.log(error);
    }
  };

  renderRooms = ({item}) => (
    <View style={{
      borderBottomColor: '#D3D3D3',
      borderBottomWidth: 1,
      marginTop: 10,
      paddingBottom: 10,
      marginHorizontal: 16
    }}>
      <Text style={{fontSize: 20}}>Room: {item.room}</Text>
      <Text style={{fontSize: 10}}>Sent: {item.sent}</Text>
      <Text style={{fontSize: 10}}>recieved: {item.received}</Text>
    </View>
  );

  getUserToken = async () => {
    let userToken = '';
    try {
      userToken = await AsyncStorage.getItem('pushToken') || 'none';
      console.log("Async push token: ", userToken);
      this.state.userToken = userToken;
    } catch (error) {
      // Error retrieving data
      console.log(error.message);
    }
  }

  addFriend = () => {
      var curr = this.state.user//firebase.auth().currentUser.uid;
      var friend = this.state.friendInput;
      //const budgets = arrayOfBudget.map((obj)=> {return Object.assign({}, obj)});
      console.log("addFriend: ", friend)
      console.log("current user: ", curr)
      if(friend < curr){
        console.log(friend + curr);
        db.collection('users').doc(curr).collection('rooms').doc(friend + curr).set({
          currentUserToken: this.state.userToken,
          room: friend + curr,
          sent: 0,
          received: 0
        })
        .then(function(){
          console.log("Friend successfullly written to firestore");
        }).catch(function(error) {
          console.log("Error writing doc to firestore: ", error);
        });
      } else {
        console.log(curr + friend);
        db.collection('users').doc(curr).collection('rooms').doc(curr + friend).set({
          currentUserToken: this.state.userToken,
          room: curr + friend,
          sent: 0,
          received: 0
        })
        .then(function(){
          console.log("Friend successfullly written to firestore");
        }).catch(function(error) {
          console.log("Error writing doc to firestore: ", error);
        });
      }

    };

render() {
  const {isDataFetched, itemArr} = this.state;
  console.log("itemArr: ", itemArr)

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'column'
      }}>
      <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection:'row', marginTop: 30}}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={text => this.handleFriendInputChange(text)}
          value={this.state.friendInput}
        />
        <AwesomeButton height={40} width={100} style={styles.button} onPress={() => this.addFriend()}> Add Friend </AwesomeButton>
      </View>

      <View style={{flex: 1, paddingTop: 20}}>
      {isDataFetched ? (
        itemArr.length > 0 ? (
        <FlatList
          ListHeaderComponent = {
            <Text style={{color:'black', fontSize: 46, paddingBottom:16, paddingLeft: 10, alignSelf:'flex-start'}}>Friends</Text>
          }
          data={this.state.itemArr}
          renderItem={this.renderRooms}
          extraData={this.state}
          keyExtractor={(item, index) => index.toString()}
          />
        ):(
            <View style={{alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'black', fontSize: 46, paddingBottom:16, paddingHorizontal: 10, alignSelf:'flex-start'}}>This is where your friends will go</Text>
            </View>
          )
        ) : (
          <View>
            <Text> Nothing to show here </Text>
          </View>
        )
        }
      </View>

    </View>
  );
}
}

const styles = StyleSheet.create({
  button: {
    margin: 8
  }
});
