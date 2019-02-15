import React from 'react'
import { View } from 'react-native'
import { MapView } from 'expo'
import TruckMarker from "../components/TruckMarker"

export default class Map extends React.Component {
  render() {
    let trucks = this.props.trucks.map(t => ({
      latitude: t.location.coordinates[1],
      longitude: t.location.coordinates[0],
      title: t.title,
      id: t.id,
      favorite: t.favorite
    }))

    let notificationCircle = this.props.locationEnabled && this.props.location && this.props.notificationDistance && <MapView.Circle
      center={this.props.location.coords}
      radius={this.props.notificationDistance}
      strokeColor={'green'}
    />

    return (
      <MapView
        provider={"google"}
        style={{ flex: 1 }}
        showsUserLocation={this.props.locationEnabled}
        showsMyLocationButton={this.props.locationEnabled}
        region={this.props.region}
        loadingEnabled={true}
        onRegionChangeComplete={region => this.props.app.setState({region})}
        // onMarkerPress={e => console.log(e)}
      >
        {trucks.map(t =>
          <TruckMarker
            truck={t}
            onPress={() => this.toggleFavorite(t.id)}
            key={t.id}
          />)}
        {notificationCircle}
      </MapView>
    )
  }
}