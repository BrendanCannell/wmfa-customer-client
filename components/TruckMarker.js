import React from 'react'
import {Image, Text} from 'react-native'
import {MapView} from 'expo'

let icons = {
  truck: require("../assets/images/truck-icon-png-10.jpg"),
  favorite: require("../assets/images/heartblue.png")
}

export default TruckMarker = props => {
  let {truck} = props
    , [longitude, latitude] = truck.location.coordinates

  return (
    <MapView.Marker
      coordinate={{longitude, latitude}}
      title={truck.title}
      onPress={props.onPress}
    >
      <Image
        source={props.isFavorite ? icons.favorite : icons.truck}
        style={{width: props.width || 40, height: props.height || 40}}
      />
      <Text>{truck.title}</Text>
      {/* <MapView.Callout>
        <Text>Test</Text>
      </MapView.Callout> */}
    </MapView.Marker>
  )
}