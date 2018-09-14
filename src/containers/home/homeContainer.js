import React,{Component} from 'react'
import {Alert} from 'react-native'
import {connect} from 'react-redux';

import Home from './home';

class HomeContainer extends Component{
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
      <Home imageData={this.props.imageData}/>
    )
  }
}

const mapStateToProps = state => ({
  images:state.search.images
})

const mapDispatchToProps = dispatch => ({
  getImages:() => dispatch(actions.getImages())
})

export default connect(mapStateToProps,mapDispatchToProps)(HomeContainer)
