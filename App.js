import React, {Component} from 'react';
import {View,StyleSheet} from 'react-native';

import {Provider} from 'react-redux';
import MainNavigator from './src/routes/navigation';
import store from './src/store/store';

export default class App extends Component{
  render(){
    return(
      <View style={styles.container}>
        <Provider store={store}>
          <MainNavigator/>
        </Provider>
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
