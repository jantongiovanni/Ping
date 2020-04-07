import React from 'react';
import { Text, View, StyleSheet, Dimensions} from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";
import Fire from '../data/Fire';

const { width: screenWidth } = Dimensions.get('window')

export default class Manage extends React.Component {
  state = {

  };

  componentDidMount() {
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({

});
