import React from 'react';
import { AsyncStorage, Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { AppLoading, Asset, Font, Icon, Location, TaskManager, Permissions, Notifications } from 'expo';
import AppNavigator from "./navigation/AppNavigator";
// import HomeScreen from "./screens/HomeScreen";

const SERVER = "http://192.168.1.80:3001";
const LOCATION_TASK = 'background-location-task';

let locationUpdateHook = {onUpdate: null}

let blankStore = {
  mapRegion: null,
  user: {},
  trucks: []
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    locations: null,
    ...blankStore
  };

  setSync = async (obj) => {
    await AsyncStorage.multiSet(Object.entries(obj).map(([k, v]) => [k, JSON.stringify(v)]))
    this.setState(obj)
    console.log('setSync user:', this.state.user)
  }

  componentDidMount = async () => {
    await AsyncStorage.clear();

    (await AsyncStorage.multiGet(Object.keys(blankStore)))
      .forEach(([k, v]) => v && this.setState({[k]: JSON.parse(v)}))

    if (!this.state.user.id) {
      this.registerWithServer()
    }

    let trucks = (await (await fetch(SERVER + "/api/truckers", {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    }).catch(e => console.error(e))).json())

    this.setSync({trucks})
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          {/* <MapScreen initialRegion={this.state.mapRegion} /> */}
          {<AppNavigator screenProps={{app: this, initialRegion: this.state.mapRegion}} />}
          {/* <HomeScreen app={this} initialRegion={this.state.mapRegion}/> */}
        </View>
      );
    }
  }

  registerWithServer = async () => {
    let initialStatus = (await Permissions.getAsync(Permissions.NOTIFICATIONS, Permissions.LOCATION)).status,
        finalStatus = initialStatus === 'granted'
          ? 'granted'
          : (await Permissions.askAsync(Permissions.NOTIFICATIONS, Permissions.LOCATION)).status
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') return;
  
    let pushToken = await Notifications.getExpoPushTokenAsync(),

        location = await Location.getCurrentPositionAsync({}),

        response = await fetch(SERVER + '/api/eaters', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            pushToken,
            favorites: [],
            location: {
              coordinates: [location.coords.longitude, location.coords.latitude]
            },
          })
        }).catch(e => console.error(e))
  
      this.setSync({ user: await response.json() })
  }

  toggleFavorite = async id => {
    let favorites = this.state.user.favorites,
        isFavorite = favorites.includes(id),
        newFavorites = isFavorite ? favorites.filter(f => f !== id) : [...favorites, id]
    
    this.setSync({ user: {...this.state.user, favorites: newFavorites} })

    // fetch(SERVER + '/api/eaters/' + this.state.user.id, {
    //   method: 'PUT',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(this.state.user)
    // }).catch(e => console.error(e))
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
      AsyncStorage.getItem('mapRegion').then(r => this.setState({mapRegion: JSON.parse(r)}))
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  // if (error) {
  //   console.error(error)
  //   return
  // }
  
  // let locations = JSON.stringify(data.locations)

  // console.log(locations)

  // try {
  //   await AsyncStorage.setItem('locations', locations)

  //   if (locationUpdateHook.onUpdate) {
  //     locationUpdateHook.onUpdate(locations)
  //   }
  // } catch (e) {
  //   console.error(e)
  // }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});