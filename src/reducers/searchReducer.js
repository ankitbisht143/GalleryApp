import * as types from '../actions/types';

const INITIAL_STATE = {
  isLoading:false,
  images:[],
  error:{}
}

export default function search(state=INITIAL_STATE,action){
  switch (action.type) {
    case types.IS_LOADING:
      return{
        ...state,
        isLoading:true
      }
      break;
    case types.SHOW_IMAGES:
      return{
        ...state,
        isLoading:false,
        images:action.images
      }
      break;
    case types.FETCH_FAILED:
      return{
        ...state,
        isLoading:false,
        error:action.error
      }
      break;
    default:
      return state
  }
}
