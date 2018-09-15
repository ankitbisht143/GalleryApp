import React,{Component} from 'react'
import {Alert,NetInfo,AsyncStorage} from 'react-native'
import {connect} from 'react-redux';

import Home from './home';
import * as actions from '../../actions/searchActions'

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
      persistData:[]
    }
  }

  componentWillUnmount(){
    page=1
    NetInfo.isConnected.removeEventListener('change', this.handleConnectionChange);

  }
  componentWillReceiveProps(nextProps){
    NetInfo.isConnected.addEventListener('change', this.handleConnectionChange);

    NetInfo.isConnected.fetch().done(
      (isConnected) => { this.setState({ status: isConnected }); }
    );
    if(nextProps.images.length>0){
      this.setState({
        images:[...this.state.images,...nextProps.images],
        responsePageCount:nextProps.totalResults,
        bottomLoading:false
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
                persistData:image
              })
            }
          }
        })
      } catch (e) {

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
    this.setState({
      images:[],
      persistData:[]
    } ,() => {
      this.props.flushImages()
      if(this.state.status == true){
        this.searchImages()
      }
      else{
        this.getPersistantData(this.state.searchInput)
      }
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

  saveImage(image,imageId){
    this.convertToBaseUrl(image, function(myBase64) {
      AsyncStorage.setItem(imageId,myBase64)
  });
  }

  generateUUID() { // Public Domain/MIT
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
        searchInput={this.state.searchInput} searchImages={this.searchImagesHandler} loadMore={this.loadMore} bottomLoading={this.state.bottomLoading} saveImage={(image) => this.saveImage(image)}/>
    )
  }
}

const mapStateToProps = state => ({
  images:state.search.images,
  totalResults:state.search.totalResults,
  isLoading:state.search.isLoading
})

const mapDispatchToProps = dispatch => ({
  getImages:(searchInput,page) => dispatch(actions.getImages(searchInput,page)),
  flushImages:() => dispatch(actions.flushImages())
})

export default connect(mapStateToProps,mapDispatchToProps)(HomeContainer)
