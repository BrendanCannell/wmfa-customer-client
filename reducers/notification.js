import R from 'ramda'

export default notification = (state = {}, {type, notification}) => {
  if (type !== 'NOTIFICATION') return state

  if (!state.trucks || !state.trucks[notification.data.id]) return {...state, notification}

  let id = notification.data.id
    , oldTruck = state.trucks[id]
    , newTruck = {
      ...oldTruck,
      location: {coordinates: R.reverse(notification.data.location.coordinates)},
      status: 'open'
    }

  return {...state, notification, trucks: {...state.trucks, [id]: newTruck}}
}