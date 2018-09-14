import React,{Component} from 'react'
import {Alert} from 'react-native'
import {connect} from 'react-redux';

import Home from './home';

export default class HomeContainer extends Component{
  constructor(props){
    super(props);

    this.state={
    }
  }

  componentDidMount(){
  }

  componentWillReceiveProps(nextProps){

  }
  render(){
    return(
      <Home/>
    )
  }
}
