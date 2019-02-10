import React from 'react'
import {Image, Text} from 'react-native'
import {MapView} from 'expo'

export default function TruckMarker(props) {
  return (
    <MapView.Marker
      coordinate={{
        latitude: props.truck.latitude,
        longitude: props.truck.longitude
      }}
      title={props.truck.title}
      onPress={props.onPress}
    >
      <Image
        source={props.truck.favorite ? props.favoriteImageSource : props.imageSource}
        style={{width: props.width || 40, height: props.height || 40}}
      />
      <Text>{props.truck.title}</Text>
      {/* <MapView.Callout>
        <Text>Test</Text>
      </MapView.Callout> */}
    </MapView.Marker>
  )
}