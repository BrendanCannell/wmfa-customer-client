import React from 'react'
import {Button, Image, Text, TouchableOpacity} from 'react-native'
import {MapView} from 'expo'
import R from 'ramda'

let icons = R.map(source =>
  <Image
    source={source}
    style={{width: 40, height: 40}}
  />, {
  markerDefault: require("../assets/images/truck-all.png"),
  markerFavorite: require("../assets/images/truck-fav.png"),
  addFavorite: require("../assets/images/heart-gray.png"),
  removeFavorite: require("../assets/images/heart-red.png"),
})

export default TruckMarker = (props) => {
  let {truck, isFavorite, toggleFavorite} = props
    , [longitude, latitude] = truck.location.coordinates

  return (
    <MapView.Marker
      coordinate={{longitude, latitude}}
      title={truck.title}
      tracksInfoWindowChanges={true}
    >
      {icons[isFavorite ? 'markerFavorite' : 'markerDefault']}
      <MapView.Callout
        tooltip
        onPress={toggleFavorite}
        style={{
          padding: 10,
          width: truck.title.length * 8 + 50,
          backgroundColor: '#fcbe59',
          flexDirection: 'row',
          justifyContent: 'space-evenly'
        }}
      >
        {icons[isFavorite ? 'removeFavorite' : 'addFavorite']}
        <Text>{truck.title}</Text>
      </MapView.Callout>
    </MapView.Marker>
  )
}