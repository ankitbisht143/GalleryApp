import React, {Component} from 'react';
import {View,StyleSheet} from 'react-native';

import {Provider} from 'react-redux';
import MainNavigator from './src/routes/navigation';

export default class App extends Component{
  render(){
    return(
      <View style={styles.container}>
          <MainNavigator/>
      </View>
    )
  }
}

const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  }
})
