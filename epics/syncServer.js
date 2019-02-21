import {of, defer, from} from 'rxjs'
import {catchError, debounceTime, distinctUntilChanged, distinctUntilKeyChanged, filter, map, retry, switchMap, tap, throttleTime} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import R from 'ramda'

import {set, update} from "../actions"
import api from "../api"


// If we don't have an id, register with the server

let register = (action$, state$) => state$.pipe(
  filter(({user, storageLoaded}) => user && !user.local.id && storageLoaded),

  distinctUntilChanged(null, getId),

  switchMap(async () => {
    console.log('registering...')

    let res = await api.post("/eaters/", {body: {username: "" + Math.random()}}).catch(null)

    if (!res.body) return

    let {_id, username} = res.body

    console.log('registration complete:', res.body._id)

    return update([['user', 'local'], R.mergeLeft({id: _id, username})])
  }),
  
  // retry(2),
  
  filter(Boolean))


// If we have an id, send user data changes to the server

let user = (action$, state$) => state$.pipe(
  distinctUntilChanged(R.equals, state => state.user && toServerSchema(state)),

  filter(({user}) => user && user.local.id),

  throttleTime(1000),

  switchMap(state =>
    defer(() => from(api.put("/eaters/" + state.user.local.id, {body: toServerSchema(state)}))).pipe(
      tap(() => console.log('sending update...')),
      retry(1),
      catchError(() => of(null)),
      tap(res => console.log(res ? 'update succeeded' : 'update failed')),
      filter(Boolean),
      map(res => update([['user', 'remote'], () => toServerSchema(state)])),)),
  )


let getId = R.path(['user', 'local', 'id'])

let toServerSchema = state => ({
  location: state.user.local.location && {
    type: 'Point',
    coordinates: R.reverse([
      state.user.local.location.coords.longitude,
      state.user.local.location.coords.latitude
    ])
  },
  ...R.pick(['favorites', 'notificationDistance', 'pushToken'], state.user.local),
  receiveNotifications: R.path(['permissions', 'notifications', 'status'], state) === 'granted'
})

export default syncServer = combineEpics(register, user)