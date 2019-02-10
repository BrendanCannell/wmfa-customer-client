import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation';

// import MainTabNavigator from './MainTabNavigator';

// export default createAppContainer(createSwitchNavigator({
//   // You could add another route here for authentication.
//   // Read more at https://reactnavigation.org/docs/en/auth-flow.html
//   Main: MainTabNavigator,
// }));

// import HomeScreen from "../screens/HomeScreen"
// import SignInScreen from "../screens/SignInScreen"
// import AuthLoadingScreen from "../screens/SignInScreen"

// let AppStack = createStackNavigator({ Home: HomeScreen, }),
//     AuthStack = createStackNavigator({ SignIn: SignInScreen })

// export default createAppContainer(createSwitchNavigator(
//   {
//     AuthLoading: AuthLoadingScreen,
//     App: AppStack,
//     Auth: AuthStack,
//   },
//   {
//     initialRouteName: 'App' //'AuthLoading',
//   }
// ))

import HomeScreen from "../screens/HomeScreen"
import SettingsScreen from "../screens/SettingsScreen"

export default createAppContainer(createStackNavigator({
  Home: HomeScreen,
  Settings: SettingsScreen
},
{
  initialRouteName: 'Home',
  transparentCard: true
}))