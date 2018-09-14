import React from 'react';
import {FlatList,Dimensions,View} from 'react-native';

import FastImage from 'react-native-fast-image'
import { Container, Header, Item, Input, Icon, Button, Text, Content, Card, Picker, Row} from 'native-base';

import {styles} from '../styles';
const SCREEN_WIDTH=Dimensions.get('window').width;

const Home = props => {
    const {container,imageContainer,text,rowContainer}=styles;
    return(
      <Container>
        <Header searchBar rounded>
          <Item>
            <Icon name="ios-search"/>
            <Input placeholder="Search"/>
          </Item>
          <Button transparent>
            <Text>Search</Text>
          </Button>
        </Header>

        <Content >
          <View style={rowContainer}>
            <Text style={text}> Number of columns :</Text>
            <Picker mode="dropdown" selectedValue={props.selectedColumn} onValueChange={(column) => props.onChangeColumn(column)}>
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
            </Picker>
          </View>
          <FlatList  key={props.selectedColumn} numColumns={props.selectedColumn} data={props.imageData} keyExtractor={(x,i) => i} renderItem={({item,index}) =>
            <Card style={[imageContainer,{width:SCREEN_WIDTH/props.selectedColumn}]}>

            </Card>
          }/>
        </Content>
      </Container>
    )
}

export default Home;
