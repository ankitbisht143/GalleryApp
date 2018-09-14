import React from 'react';
import {FlatList} from 'react-native';
import { Container, Header, Item, Input, Icon, Button, Text, Content } from 'native-base';

import {styles} from '../styles';

const Home = props => {
    const {container}=styles;
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

        <Content>
          <FlatList data={props.imageData} keyExtractor={(x,i) => i} renderItem={({item,index}) =>
            <Container>
            </Container>
          }/>
        </Content>
      </Container>
    )
}

export default Home;
