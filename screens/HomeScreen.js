import React from 'react';

import {
  AsyncStorage,
  Button,
  Text,
  View,
  AppState,
} from 'react-native';

import {
  Location,
  Permissions,
  Notifications,
  TaskManager,
} from 'expo';

import Map from "../components/Map"

import Frisbee from 'frisbee'
import * as R from 'ramda'

let LOCATION_TASK = 'background-location-task',
    locationUpdateHook = {onUpdate: null}

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error(error)
    return
  }
  
  let location = data.locations[0]

  if (location && locationUpdateHook.onUpdate) {
    locationUpdateHook.onUpdate(location)
  }
})

let api = new Frisbee({
  baseURI: "http://192.168.1.80:3001/api",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

let defaultPreferences = {
  favorites: [],
  receiveNotifications: true,
  notificationDistance: 1000
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  _setState = this.setState

  setState = async (changes, ...rest) => {
    let oldState = this.state || {}
      , newState = () => ({...oldState, ...changes})
      , whenTestChanges = (test, branches) => {
          let oldTest = test(oldState)
            , newTest = test(newState())

          if (!branches) console.log("!branches")
          
          if (!oldTest && newTest && branches.true) {
            return branches.true()
          } else if (oldTest && !newTest && branches.false) {
            return branches.false()
          }
        }

    await whenTestChanges(state => locationInUseGranted(state.permissions), {
      // when we get permission to see the user's location when foregrounded...
      true: async () => {
        console.log("Location in use permissions granted")

        // update user location
        let location = await getLocation()
        if (location) {
          changes.location = location
        }

        // and if the map region hasn't been set (because the app just started), make it the user's vicinity
        if (location && !newState().region) {
          changes.region = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0,
            longitudeDelta: 0.2,
          }
        }
      },

      // when we lose that permission, forget the location
      false: () => {
        console.log("Location in use permissions revoked")
        changes.location = null
      }
    })

    await whenTestChanges(state => locationAlwaysGranted(state.permissions), {
      // when we get permission to see the user's location at all times, begin monitoring it
      true: async () => {
        console.log("Location always permissions granted")

        await Location.startLocationUpdatesAsync(LOCATION_TASK, {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 100
        })
  
        changes.backgroundLocationRunning = true
      },

      // when we lose that permission, stop monitoring
      false: async () => {
        console.log("Notification always permissions revoked")

        await Location.stopLocationUpdatesAsync(LOCATION_TASK)
  
        changes.backgroundLocationRunning = false
      }
    })

    await whenTestChanges(state => R.path(['notifications', 'status'], state.permissions) === 'granted', {
      true: async () => {
        console.log("Notification permissions -> true")
        changes.pushToken = await Notifications.getExpoPushTokenAsync()
        console.log(changes.pushToken)
      }
    })

    // When the app is first installed, we need to get an id from the server
    if (!newState().id) {
      this.registerWithServer()
    }
    
    // When we get an id, or when we already have one and user data changes, update the server
    else if (changes.id || !R.equals(user(oldState), user(newState()))) {
      let newUserVersion = oldState.userVersion + 1

      changes.userVersion = newUserVersion

      this.updateServer(user(newState()), newUserVersion)
    }

    console.log("setState final changes:", changes)

    return this._setState(changes, ...rest)
  }

  // All permissions are resolved and stored values loaded first - DONE

  // When notification permission is granted, we need to update the server with our location
  // state.id starts as `null`
  // We first load the id from storage. If empty, we request an id from the server. Once we have it, 
  // We start updating location on mount.

  // if (changes.id || (newState.id && (changes.location || changes.favorites || ...))) send PUT request with user info

  // When notification permission is denied, the user can view the map and trucks
  
  // When location permission is granted, we start up with the map centered on the location.
  // Otherwise, it starts at a generic region
  // Either way, we query for trucks within that region whenever it changes

  // https://docs.expo.io/versions/v32.0.0/react-native/appstate
  // https://developer.apple.com/library/archive/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/TheAppLifeCycle/TheAppLifeCycle.html
  // https://developer.apple.com/library/archive/documentation/iPhone/Conceptual/iPhoneOSProgrammingGuide/BackgroundExecution/BackgroundExecution.html#//apple_ref/doc/uid/TP40007072-CH4-SW1



  componentDidMount = async () => {
    console.log("HomeScreen mounted")

    let store = await getStore(),
        permissions = await getPermissions()

    console.log('store:', store)
    console.log('permissions:', permissions)

    await this.setState({
      id: null,
      userVersion: 0,
      ...defaultPreferences,
      pushToken: null,
      location: null,
      region: null,
      trucks: [],
      backgroundLocationRunning: false,
      ...store,
      permissions})

    locationUpdateHook.onUpdate = location => this.setState({location})

    AppState.addEventListener('change', this.updatePermissions)
  }

  updatePermissions = async () => {
    let permissions = await getPermissions()

    return this.setState({permissions})
  }

  registerWithServer = async () => {
    console.log("Registering with server...")

    let res = await api.post("/eaters").catch(() => null)

    if (res) console.log("Registration complete")

    return res && this.setState({
      id: res.body._id,
      serverUserVersion: 0
    })
  }

  updateServer = async (user, userVersion) => {
    console.log('Updating server...')

    let res = await api.put("/eaters" + this.state.id, {
      body: {
        ...user,
        userVersion
      }
    }).catch(() => null)

    console.log(res ? "Update complete" : "Update failed")

    if (res && userVersion > this.state.serverUserVersion) {
      return this.setState({serverUserVersion: userVersion})
    }
  }

  toggleFavorite = async truckId => {
    console.log("Toggling " + (trucks.find(truck => truck.id === truckId) || {}).title)

    let oldFavorites = this.state.user.favorites,
        isFavorite = oldFavorites.includes(truckId),
        favorites = isFavorite
          ? oldFavorites.filter(fav => fav !== truckId)
          : [...oldFavorites, truckId]
    
    this.setState({favorites})
  }

  render = () => this.state ?
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch'}}>
        <View style={{flex: 1, justifyContent: 'center', borderWidth: 2}}>
          <Text style={{color: 'white', fontSize: 48, textAlign: 'center', textAlignVertical: 'center'}}>WMFA!?</Text>
        </View>
        <View style={{justifyContent: 'center', borderWidth: 2}}>
          <Button
            title="Settings"
            onPress={() => this.props.navigation.navigate("Settings", {app: this, appState: this.state})}
          />
        </View>
      </View>
      <Map
        app={this}
        trucks={this.state.trucks}
        region={this.state.region}
        location={this.state.location}
        locationEnabled={locationInUseGranted(this.state.permissions)}
        notificationDistance={this.state.notificationDistance}
      />
    </View>
    : <View />
}

let locationInUseGranted = permissions =>
  ['always', 'whenInUse'].includes(R.path(['location', 'ios', 'scope'], permissions))
  || locationGrantedAndroid(permissions)

let locationAlwaysGranted = permissions =>
  R.path(['location', 'ios', 'scope'], permissions) === 'always'
  || locationGrantedAndroid(permissions)

let locationGrantedAndroid = permissions =>
  !R.path(['location', 'ios'], permissions)
  && R.path(['location', 'status'], permissions) === 'granted'

let getLocation = () => Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced}).catch(() => null)

let getStore = async () => {
  let storedKVs = await AsyncStorage.multiGet(await AsyncStorage.getAllKeys()),

      stored = {}; storedKVs.forEach(([k, v]) => stored[k] = JSON.parse(v))

  return stored
}

let setStore = obj => AsyncStorage.multiSet(Object.entries(obj).map(([k, v]) => [k, JSON.stringify(v)]))

let clearStore = () => AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)

let getPermissions = async () => {
  let permissions = {
    location: (await Permissions.askAsync(Permissions.LOCATION)).permissions[Permissions.LOCATION],
    notifications: (await Permissions.askAsync(Permissions.NOTIFICATIONS)).permissions[Permissions.NOTIFICATIONS]
  }

  // console.log('permissions:', {
  //   location: (await Permissions.askAsync(Permissions.LOCATION)),
  //   notifications: (await Permissions.askAsync(Permissions.NOTIFICATIONS))
  // })

  return permissions
}

let user = state => ({
  location: state.location && {
    type: 'Point',
    coordinates: [state.location.coords.longitude, state.location.coords.latitude]
  },
  ...R.project(['favorites', 'receiveNotifications', 'notificationDistance', 'pushToken'], [state])
})