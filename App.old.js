import React from 'react';
import { AsyncStorage, Platform, StatusBar, StyleSheet, View, Text } from 'react-native';
import { AppLoading, Asset, Font, Icon, Location, TaskManager } from 'expo';
import AppNavigator from './navigation/AppNavigator';

const LOCATION_TASK = 'background-location-task';

let locationUpdateHook = {onUpdate: null}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    locations: null
  };

  componentDidMount() {
    locationUpdateHook.onUpdate = (locations) => this.setState({locations})

    Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced
    })
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
          <AppNavigator />
          <Text>{this.state.locations || "Waiting..."}</Text>
        </View>
      );
    }
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
  if (error) {
    console.error(error)
    return
  }
  
  let locations = JSON.stringify(data.locations)

  console.log(locations)

  try {
    await AsyncStorage.setItem('locations', locations)

    if (locationUpdateHook.onUpdate) {
      locationUpdateHook.onUpdate(locations)
    }
  } catch (e) {
    console.error(e)
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
