import { createAppContainer, createStackNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';

import HomeScreen from "../screens/HomeScreen"
import SettingsScreen from "../screens/SettingsScreen"

export default createAppContainer(createStackNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen
},
{
  initialRouteName: 'Home'
}))