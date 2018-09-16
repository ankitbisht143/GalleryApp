import React,{Component} from 'react'
import {Alert,NetInfo,AsyncStorage,Dimensions} from 'react-native'
import {connect} from 'react-redux';
import FastImage from 'react-native-fast-image'
import {isEqual} from 'lodash'

import Home from './home';
import * as actions from '../../actions/searchActions'
const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT=Dimensions.get('window').height;

var page=1;

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
      responsePageCount:15,
      status:true,
      persistData:[],
      isLoading:false
    }
  }

  componentWillMount(){
    NetInfo.getConnectionInfo().then((connectionInfo) => {
    });
  }
  componentWillUnmount(){
    page=1
    NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectionChange);
  }

  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps.images) == JSON.stringify(this.props.images)) {return}
    if(nextProps.images.length>0){
      this.setState({
        images:[...this.state.images,...nextProps.images],
        responsePageCount:nextProps.totalResults,
      })
      this.persistData(nextProps.images,this.state.searchInput)
    }
  }

  persistData(images,searchString){
    if(images.length>0){
      var imageData=[]
      var offlineData={}
      AsyncStorage.getItem('offline').then((value) => {
        if(value){
          value=JSON.parse(value)
          offlineData=value
        }
        if(value && value[searchString]){
          imageData=value[searchString]
        }
        for(var i=0;i<images.length;i++){
          if(images[i] && images[i].pagemap && images[i].pagemap.cse_image && images[i].pagemap.cse_image.length>0){
            var uuid=this.generateUUID()
            this.saveImage(images[i].pagemap.cse_image[0].src,uuid)
            imageData.push(uuid)
          }
        }
        offlineData[searchString]=imageData
        AsyncStorage.setItem('offline',JSON.stringify(offlineData))
      })
    }
  }

  handleConnectionChange = (isConnected) => {
    this.setState({ status: isConnected });
  }

  getImage(uuid){
      return new Promise(function(resolve, reject) {
        AsyncStorage.getItem(uuid).then((value) => {
          if(value){
             resolve(value)
          }
           resolve(null)
        })
      });
  }

    getPersistantData(searchString){
      try {
        AsyncStorage.getItem('offline').then( async (value) => {
          if(value){
            value=JSON.parse(value)
            if(value[searchString]){
              var searchData=value[searchString]
              var image=[]
              for(var i=0;i<searchData.length;i++){
                var imageData=await this.getImage(searchData[i])
                image.push(imageData)
              }
              this.setState({
                persistData:image,
                isLoading:false
              })
            }
            else{
              this.setState({
                isLoading:false
              })
            }
          }
          else{
            this.setState({
              isLoading:false
            })
          }
        })
      } catch (e) {
        this.setState({
          isLoading:false
        })
      }
  }

convertToBaseUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
      var reader = new FileReader();
      reader.onloadend = function() {
          callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

  searchImages(){
    if(this.state.searchInput.length>0){
      this.props.getImages(this.state.searchInput,page)
    }
  }

  searchImagesHandler(){
    page=1

    NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectionChange);

    NetInfo.getConnectionInfo().then((connectionInfo) => {
    if(connectionInfo.type == 'none'){
        this.setState({
          persistData:[],
          images:[],
          isLoading:true
        },() => {
          this.getPersistantData(this.state.searchInput)
        })
        return ;
    }
    this.setState({
      images:[],
      persistData:[]
    },() => {
      this.props.flushImages()
      if(this.state.searchInput.length>0){
        this.searchImages()
      }
    })
  });
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
    page=page+10
    if(this.props.totalResults >= page){
      this.searchImages()
    }
  }

  saveImage(image,imageId){
    this.convertToBaseUrl(image, function(myBase64) {
      AsyncStorage.setItem(imageId,myBase64)
  });
  }

  generateUUID() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

  render(){
    return(
      <Home persistData={this.state.persistData} isLoading={this.props.isLoading} images={this.state.images} selectedColumn={this.state.selectedColumn} onChangeColumn={(column) => this.onChangeColumn(column)} handleSearchInput={(searchInput) => this.handleSearchInput(searchInput)}
        searchInput={this.state.searchInput} isLoading={this.state.isLoading} searchImages={this.searchImagesHandler} loadMore={this.loadMore} bottomLoading={this.state.bottomLoading} saveImage={(image) => this.saveImage(image)}/>
    )
  }
}

const mapStateToProps = state => ({
  images:state.search.images,
  totalResults:state.search.totalResults
})

const mapDispatchToProps = dispatch => ({
  getImages:(searchInput,page) => dispatch(actions.getImages(searchInput,page)),
  flushImages:() => dispatch(actions.flushImages())
})

export default connect(mapStateToProps,mapDispatchToProps)(HomeContainer)
