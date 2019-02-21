// TODO
// Handle push notifications
// Persist user data
// Send user data to server
// Query server for trucks whenever region is set
// UI

import React from 'react'
import { AppRegistry, AppState, View, TouchableOpacity } from 'react-native'
import { Provider } from 'react-redux'
import { Notifications } from 'expo'
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

    // Subscribe to...

    // ...app state changes
    AppState.addEventListener('change', () => this.store.dispatch({type: 'APP_STATE_CHANGE'}))

    // ...background location updates
    setOnUpdate(location => this.store.dispatch(update([['user', 'local', 'location'], () => location])))

    // ...notifications
    Notifications.addListener(notification => console.log('notification:', notification) || this.store.dispatch({type: 'NOTIFICATION', notification}))

    // Set initial state
    this.store.dispatch(set({
      user: {
        local: {
          id: null,
          favorites: [],
          notificationDistance: 1000,
          pushToken: null,
          location: null,
          timestamp: Date.now()
        },
        remote: null
      },
      region: null,
      trucks: {},
      storageLoaded: false,
      watchingBackground: false,
    }))

    // Go
    this.store.dispatch({type: 'START'})
  }

  render = () =>
    <Provider store={this.store}>
      <AppNavigator />
    </Provider>
}

AppRegistry.registerComponent('App', () => App)

export default App