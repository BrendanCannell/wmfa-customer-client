import {of, defer, from} from 'rxjs'
import {catchError, debounceTime, distinctUntilChanged, distinctUntilKeyChanged, filter, map, retry, switchMap, tap, throttleTime} from 'rxjs/operators'
import {combineEpics, ofType} from 'redux-observable'
import R from 'ramda'

import {set, update} from "../actions"
import api from "../api"


// If we don't have an id, register with the server

let register = (action$, state$) => state$.pipe(
  filter(({user, storageLoaded}) => user && !user.local.id && storageLoaded),

  distinctUntilChanged(getId),

  switchMap(async () => {
    console.log('registering...')

    let {body: {_id, username}} = await api.post("/eaters/")

    console.log('registration complete')

    return update([['user', 'local'], R.mergeLeft({id: _id, username})])
  }),
  
  retry(2))


// If we have an id, send user data changes to the server

let user = (action$, state$) => state$.pipe(
  distinctUntilChanged(({user}) => user && user.local, R.equals),

  filter(({user}) => user && user.local.id),

  throttleTime(10000),

  switchMap(({user: {local}}) =>
    defer(() => from(api.put("/eaters/" + local.id, {body: toServerSchema(local)}))).pipe(
      tap(() => console.log('sending update...')),
      retry(1),
      catchError(() => of(null)),
      tap(res => console.log(res ? 'update succeeded' : 'update failed')),
      filter(Boolean),
      map(res => update([['user', 'remote'], R.mergeLeft(res.body || {})])),)),
  )


let getId = R.path(['user', 'local', 'id'])

let toServerSchema = user => ({
  location: user.location && {
    type: 'Point',
    coordinates: [user.location.coords.longitude, user.location.coords.latitude]
  },
  ...R.pick(['favorites', 'receiveNotifications', 'notificationDistance', 'pushToken'], user)
})

export default syncServer = combineEpics(register, user)