import * as types from './types';

export function imagesFound(images){
  return{
    type:types.SHOW_IMAGES,
    images
  }
}

export function isLoading(bool){
  return{
    type:types.isLoading,
    isLoading:bool
  }
}

export function getImages(){
  return dispatch => {
    dispatch(isLoading(true));
    return fetch('http://35.197.140.149:8000/v1/product')
      .then((response) => {
        if(response.status < 300){
          dispatch(isLoading(false));
          response.json().then((responseJSON) => {
            dispatch(imagesFound(responseJSON.products))
          })
        }
      })
  }
}
