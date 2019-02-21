import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator
} from "react-navigation";

import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import Landing from "../screens/Landing";

export default createAppContainer(
  createStackNavigator(
    {
      Home: HomeScreen,
      Settings: SettingsScreen,
      Landing: Landing
    },
    {
      initialRouteName: "Home"
    }
  )
);
