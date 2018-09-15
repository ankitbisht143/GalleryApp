import * as types from './types';
const API_KEY="AIzaSyAT6rN9tO5M0h1hrGfdSqvDXfZF7jt1sMc"

export function imagesFound(images,totalResults){
  return{
    type:types.SHOW_IMAGES,
    images:images,
    totalResults:totalResults
  }
}

export function isLoading(bool){
  return{
    type:types.IS_LOADING,
    isLoading:bool
  }
}

export function flushImages(){
  return{
    type:types.FLUSH_IMAGES,
  }
}


export function getImages(searchInput,page){
  return dispatch => {
    dispatch(isLoading(true));
    return fetch(`https://www.googleapis.com/customsearch/v1?key=${API_KEY}&q=${searchInput}&start=${page}&cx=012426156823760153953:0q63l3kremo`)
      .then((response) => {
        if(response.status < 300){
          dispatch(isLoading(false));
          response.json().then((responseJSON) => {
            dispatch(imagesFound(responseJSON.items,parseInt(responseJSON.searchInformation.totalResults)))
          })
        }
      })
  }
}
