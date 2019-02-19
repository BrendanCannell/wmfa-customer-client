import update from "./update"
import R from 'ramda'

let toggle = truck => R.ifElse(R.contains(truck), R.without(truck), R.append(truck))

export default toggleFavorite = truck => update([['user', 'local', 'favorites'], toggle(truck)])