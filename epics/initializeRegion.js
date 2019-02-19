import {filter, map} from 'rxjs/operators'
import {set} from "../actions"

// If we've just started and the map region is empty, set it to the user's vicinity when that becomes available

export default (action$, state$) => state$.pipe(
  filter(({region, user}) =>  !region && user && user.local.location && (console.log('setting region') || true)),

  map(({user}) => set({region: {
    latitude: user.local.location.coords.latitude,
    longitude: user.local.location.coords.longitude,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  }})))