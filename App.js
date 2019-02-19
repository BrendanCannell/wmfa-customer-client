// TODO
// Handle push notifications
// Persist user data
// Send user data to server
// Query server for trucks whenever region is set
// UI

import React from 'react'
import { AppRegistry, AppState, View, TouchableOpacity } from 'react-native'
import { Provider } from 'react-redux'
import R from 'ramda'

import store from "./store"
import {set, update} from "./actions"
import AppNavigator from "./navigation/AppNavigator"

// The background location task must be defined in the bundle global scope. The app component hooks into it during construction.
import { define } from "./backgroundLocationTask"
let setOnUpdate = define()

class App extends React.Component {
  constructor() {
    super()

    this.store = store

    // Subscribe to app state changes
    AppState.addEventListener('change', () => this.store.dispatch({type: 'APP_STATE_CHANGE'}))

    // Subscribe to background location updates
    setOnUpdate(location => this.store.dispatch(update([['user', 'local', 'location'], () => location])))

    // Set initial state
    this.store.dispatch(set({
      user: {
        local: {
          id: null,
          preferences: {
            favorites: [],
            receiveNotifications: true,
            notificationDistance: 1000
          },
          pushToken: null,
          location: null,
          timestamp: Date.now()
        },
        remote: null
      },
      region: null,
      trucks: {
        '0': {
          location: {
            coordinates: [-79, 35]
          },
          title: "Trucko",
          isFavorite: false
        }
      },
      storageLoaded: false,
      backgroundLocationTaskRunning: false,
    }))

    // Go
    this.store.dispatch({type: 'START'})
  }

  render() {
    return (
      // <TouchableOpacity style={{flex: 1, alignItems: 'stretch', backgroundColor: 'blue'}} onPress={() => this.store.dispatch(set({here: true}))} />

      <Provider store={this.store}>
        <AppNavigator />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('App', () => App)

export default App