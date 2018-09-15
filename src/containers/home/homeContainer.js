import React,{Component} from 'react'
import {Alert} from 'react-native'
import {connect} from 'react-redux';

import Home from './home';
import * as actions from '../../actions/searchActions'

import RNFetchBlob from "react-native-fetch-blob";
const fs = RNFetchBlob.fs;
let imagePath = null;
RNFetchBlob.config({
  fileCache: true
})

var page=1;
const imagePlaceholder="http://meeconline.com/wp-content/uploads/2014/08/placeholder.png"

class HomeContainer extends Component{
  constructor(props){
    super(props);
    this.searchImages=this.searchImages.bind(this);
    this.loadMore=this.loadMore.bind(this);
    this.searchImagesHandler=this.searchImagesHandler.bind(this);

    this.state={
      selectedColumn:'2',
      searchInput:'',
      bottomLoading:false,
      images:[],
      responsePageCount:15
    }
  }

  componentWillUnmount(){
    page=1
  }
  componentWillReceiveProps(nextProps){
    if(isStartFromBegin){
      this.setState({
        images:[]
      }, () => {
        this.setState({
          images:[...this.state.images,...nextProps.images],
          responsePageCount:nextProps.totalResults,
          bottomLoading:false
        })
      })
      return
    }
    this.setState({
      images:[...this.state.images,...nextProps.images],
      responsePageCount:nextProps.totalResults,
      bottomLoading:false
    })
  }
  searchImages(){
    this.props.getImages(this.state.searchInput,page)
  }
  searchImagesHandler(){
    page=1
    this.setState({
      images:[],
      isStartFromBegin:true
    }, () => {
      this.searchImages()
    })
  }
  onChangeColumn(column){
    this.setState({
      selectedColumn:column
    })
  }

  handleSearchInput(searchInput){
    this.setState({
      searchInput:searchInput
    })
  }

  loadMore(){
    page=page+1
    if(this.props.totalResults >= page){
      this.setState({bottomLoading:true})
      this.searchImages()
    }
  }
  render(){
    return(
      <Home isLoading={this.props.isLoading} images={this.state.images} selectedColumn={this.state.selectedColumn} onChangeColumn={(column) => this.onChangeColumn(column)} handleSearchInput={(searchInput) => this.handleSearchInput(searchInput)}
        searchInput={this.state.searchInput} searchImages={this.searchImagesHandler} loadMore={this.loadMore} bottomLoading={this.state.bottomLoading}/>
    )
  }
}

const mapStateToProps = state => ({
  images:state.search.images,
  totalResults:state.search.totalResults,
  isLoading:state.search.isLoading
})

const mapDispatchToProps = dispatch => ({
  getImages:(searchInput,page) => dispatch(actions.getImages(searchInput,page))
})

export default connect(mapStateToProps,mapDispatchToProps)(HomeContainer)
