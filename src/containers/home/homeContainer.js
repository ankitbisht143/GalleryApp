import React,{Component} from 'react'
import {Alert} from 'react-native'
import {connect} from 'react-redux';

import Home from './home';
import * as actions from '../../actions/searchActions'

class HomeContainer extends Component{
  constructor(props){
    super(props);
    this.state={
      selectedColumn:'2'
    }
  }
  componentDidMount(){
    this.props.getImages()
  }

  onChangeColumn(column){
    this.setState({
      selectedColumn:column
    })
  }
  render(){
    return(
      <Home imageData={this.props.images} selectedColumn={this.state.selectedColumn} onChangeColumn={(column) => this.onChangeColumn(column)}/>
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
