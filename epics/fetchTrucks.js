import {distinctUntilKeyChanged, filter, switchMap} from 'rxjs/operators'
import R from 'ramda'

import {update} from "../actions"
import api from "../api"

// Fetch trucks in the map region whenever it changes

export default (action$, state$) => state$.pipe(
  filter(R.prop('region')),

  distinctUntilKeyChanged('region', R.equals),

  switchMap(async ({region}) => {
    let query = toQuery(region)

      , res = await api.get("/truckers", {body: {query: JSON.stringify(query)}})

      , trucks = R.fromPairs(res.body.map(truck => [truck._id, truck]))

    return update([['trucks'], R.mergeLeft(trucks)])
  })
)

let toQuery = ({latitude, longitude, latitudeDelta, longitudeDelta}) => {
  let limitLat = lat => Math.max(-90, Math.min(90, lat))
    , limitLon = lon => Math.max(-180, Math.min(180, lon))

    , latTop    = limitLat(latitude + latitudeDelta)
    , latBottom = limitLat(latitude - latitudeDelta)
    , lonLeft  = limitLon(longitude + longitudeDelta)
    , lonRight = limitLon(longitude - longitudeDelta)

  return {
    location: {
      $geoWithin: {
        $geometry: {
          type: "Polygon",
          coordinates: [[
            [lonLeft, latTop],
            [lonLeft, latBottom],
            [lonRight, latBottom],
            [lonRight, latTop],
            [lonLeft, latTop]
          ]]
        }
      }
    }
  }
}