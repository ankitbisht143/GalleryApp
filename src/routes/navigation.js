import {StackNavigator} from 'react-navigation';

import Home from '../scenes/home';

const MainNavigator = StackNavigator({
  home:{screen:Home,navigationOptions:{header:null,gesturesEnabled: false}}
})

export default MainNavigator
