import update from "./update"
import R from 'ramda'

let toggle = truck => favorites =>
  R.contains(truck, favorites)
  ? R.without([truck], favorites)
  : R.append(truck, favorites)

export default toggleFavorite = truck => update([['user', 'local', 'favorites'], toggle(truck)])