import {StyleSheet,Platform,Dimensions} from 'react-native';

const SCREEN_WIDTH=Dimensions.get('window').width;
const SCREEN_HEIGHT=Dimensions.get('window').height;

export const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  imageContainer:{
    height:120
  },
  text:{
    marginTop:12
  },
  rowContainer:{
    flexDirection:'row',
    marginLeft:0
  }
})
