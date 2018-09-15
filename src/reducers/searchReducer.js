import * as types from '../actions/types';

const INITIAL_STATE = {
  isLoading:false,
  images:[],
  error:{},
  totalResults:0
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
        images:action.images,
        totalResults:action.totalResults
      }
      break;
    case types.FLUSH_IMAGES:
      return{
        images:[]
      }
      break;
    default:
      return state
  }
}
