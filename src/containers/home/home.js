import React from 'react';
import {FlatList,Dimensions,View,Alert,ActivityIndicator} from 'react-native';

import FastImage from 'react-native-fast-image'
import { Container, Header, Item, Input, Icon, Button, Text, Content, Card, Picker, Row} from 'native-base';
import Lightbox from 'react-native-lightbox';

import {styles} from '../styles';
const SCREEN_WIDTH=Dimensions.get('window').width;
const imagePlaceholder="http://meeconline.com/wp-content/uploads/2014/08/placeholder.png"

const Home = props => {
    const {container,text,rowContainer,spinner}=styles;
    return(
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search"/>
            <Input onSubmitEditing={props.searchImages} placeholder="Search" onChangeText={(searchInput) => props.handleSearchInput(searchInput)} value={props.searchInput}/>
          </Item>
          <Button onPress={props.searchImages} transparent>
            <Text>Search</Text>
          </Button>
        </Header>
        <Content contentContainerStyle={{flex: 1}}>
          <View style={rowContainer}>
            <Text style={text}> Number of columns :</Text>
            <Picker mode="dropdown" selectedValue={props.selectedColumn} onValueChange={(column) => props.onChangeColumn(column)}>
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
            </Picker>
          </View>

          <FlatList onEndReached={props.loadMore} onEndReachedThreshold={0.5}  key={props.selectedColumn} numColumns={props.selectedColumn} data={props.persistData && props.persistData.length>0?props.persistData:props.images} keyExtractor={(x,i) => i} renderItem={({item,index}) =>
            <Lightbox springConfig={{tension: 15, friction: 7}} underlayColor="white">
              <FastImage style={{alignSelf:'center',width:SCREEN_WIDTH/props.selectedColumn,height:SCREEN_WIDTH/props.selectedColumn}} source={{uri:props.persistData && props.persistData.length>0?item:item.pagemap && item.pagemap.cse_image && item.pagemap.cse_image.length>0?encodeURI(item.pagemap.cse_image[0].src):imagePlaceholder,priority:FastImage.priority.normal}} resizeMode={FastImage.resizeMode.stretch}/>
            </Lightbox>
          }/>
          <ActivityIndicator style={{display:props.bottomLoading?"flex":"none"}} animating={props.bottomLoading} size="small" />

        </Content>
      </Container>
    )
}

export default Home;
