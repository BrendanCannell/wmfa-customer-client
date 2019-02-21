import {AsyncStorage} from 'react-native'
import {Location, Notifications, Permissions} from 'expo'
import {bindCallback} from 'rxjs'
import {distinctUntilChanged, distinctUntilKeyChanged, filter, map, switchMap, tap} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import R from 'ramda'

import {set, update} from "../actions"
import {locationAlwaysGranted} from "../util"
import {taskName} from "../backgroundLocationTask"


// Run the background location task whenever we have permission

let locationBackground = (action$, state$) => state$.pipe(
  filter(R.prop('permissions')), // To prevent unwatching before watching

  distinctUntilKeyChanged('permissions', R.equals),

  switchMap(async ({permissions, watchingBackground = false}) => {
    let shouldWatchBackground = locationAlwaysGranted(permissions)

    if (watchingBackground !== shouldWatchBackground) {
      await (shouldWatchBackground ? watchBackground : unwatchBackground)()
    }

    return set({watchingBackground: shouldWatchBackground})
  }))

let watchBackground = () => console.log('watching background') || Location.startLocationUpdatesAsync(taskName, {
  accuracy: Location.Accuracy.Balanced,
  distanceInterval: 100
})

let unwatchBackground = () => console.log('unwatching background') || Location.stopLocationUpdatesAsync(taskName)


// Watch the location whenever we have permission 

// let locationForeground = (action$, state$) => state$.pipe(
//   distinctUntilChanged(({permissions}) => locationInUseGranted(permissions)),

//   switchMap(async ({permissions, watchingForeground, unwatchForeground}) => {
//     let shouldWatchForeground = locationInUseGranted(permissions)

//     if (shouldWatchForeground && !watchingForeground) {
//       console.log('watching foreground')
//       return set({watchingForeground: true, unwatchForeground: (await watchForeground()).remove})
//     } else if (!shouldWatchForeground && watchingForeground) {
//       if (unwatchForeground) unwatchForeground()

//       return set({watchingForeground: false, unwatchForeground: null})
//     }
//   }),

//   filter(Boolean),
// )
// // TODO Hook this up
// let watchForeground = () =>
//   Location.watchPositionAsync(
//     {accuracy: Location.Accuracy.Balanced},
//     location => console.log('watchForeground') || update([['user', 'local', 'location'], () => location]))


// Temporary substitute until the above can be done properly

let locationForegroundByPermissions = (action$, state$) => state$.pipe(
  distinctUntilChanged(null, ({permissions}) => locationInUseGranted(permissions)),

  switchMap(async ({permissions, watchingForeground, unwatchForeground}) => {
    let shouldWatchForeground = locationInUseGranted(permissions)

    if (!shouldWatchForeground) return

    let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced}).catch(() => null)

    return location && console.log('updating location due to permissions change') || update([['user', 'local', 'location'], () => location])
  }),

  filter(Boolean),
)

let locationForegroundByAppState = (action$, state$) => action$.pipe(
  ofType('APP_STATE_CHANGE'),

  switchMap(async () => {
    let shouldWatchForeground = locationInUseGranted(state$.value.permissions)

    if (!shouldWatchForeground) return

    let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced}).catch(() => null)

    return location && console.log('updating location due to app state change') || update([['user', 'local', 'location'], () => location])
  }),

  filter(Boolean),
)


// Permissions can change whenever the app is off or in the background, so they must be refreshed on startup and state changes

let permissions = (action$, state$) => action$.pipe(
  ofType('START', 'APP_STATE_CHANGE'),

  switchMap(async () => {
    let get = async type => (await Permissions.askAsync(type)).permissions[type]

      , permissions = {
          location: await get(Permissions.LOCATION),
          notifications: await get(Permissions.NOTIFICATIONS),
        }

    console.log('permissions:', permissions)

    return set({permissions})
  })
)


// When granted notification permission, refresh the push token

let pushToken = (action$, state$) => state$.pipe(
  distinctUntilKeyChanged('permissions', R.equals),

  filter(({permissions}) => permissions && permissions.notifications.status === 'granted'),

  switchMap(async () => {
    let pushToken = await Notifications.getExpoPushTokenAsync()

    console.log('pushToken:', pushToken)

    return update([['user', 'local', 'pushToken'], () => pushToken])
  })
)


// On startup anything in storage is loaded into the state

let storageLoad = (action$, state$) => action$.pipe(
  ofType('START'),
  
  switchMap(async () => {
    let keys = await AsyncStorage.getAllKeys()

      , keyValPairs = await AsyncStorage.multiGet(keys)
      
      , withParsedVals = keyValPairs.map(([k, v]) => [k, JSON.parse(v)])

      , storage = R.fromPairs(withParsedVals)

    console.log('storage: ', storage)

    // return set({storageLoaded: true}) // For resets
    return set({...storage, storageLoaded: true})
  }))


// After storage is loaded, changes to user data are persisted as JSON

let storageSave = (action$, state$) => state$.pipe(
  filter(R.prop('storageLoaded')),

  distinctUntilKeyChanged('user', R.equals),

  switchMap(({user}) =>
    AsyncStorage.setItem('user', JSON.stringify(user))),
    
  filter(() => {}))


export default syncHost = combineEpics(locationBackground, locationForegroundByPermissions, locationForegroundByAppState, permissions, pushToken, storageLoad, storageSave)