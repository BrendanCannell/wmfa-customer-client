import React from 'react';

import {
  AsyncStorage,
  Button,
  Text,
  View,
} from 'react-native';

import {
  Location,
  MapView,
  Permissions,
} from 'expo';

import TruckMarker from "../components/TruckMarker"
import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      height: 80,
      backgroundColor: '#209AFF',
    },
    headerTitle:
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch'}}>
        <View style={{flex: 1, justifyContent: 'center', borderWidth: 2}}>
          <Text style={{ color: 'white', fontSize: 48, textAlign: 'center', textAlignVertical: 'center' }}>WMFA!?</Text>
        </View>
        <View style={{justifyContent: 'center', borderWidth: 2}}>
          <Button
            title="Settings"
            onPress={() => {}}
          />
        </View>
      </View>,
  }
  
  state = {
    region: this.props.initialRegion,
    errorMessage: null,
  }

  render() {
    let trucks = this.props.app.state.trucks.map(t => ({
      latitude: t.location.coordinates[1],
      longitude: t.location.coordinates[0],
      title: t.title,
      id: t.id,
      favorite: this.props.app.state.user.favorites && this.props.app.state.user.favorites.includes(t.id)
    }))
    
    return (
      <MapView
        provider={"google"}
        style={{ flex: 1 }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={this.props.initialRegion}
        onRegionChangeComplete={r => AsyncStorage.setItem('mapRegion', JSON.stringify(r))}
        // onMarkerPress={e => console.log(e)}
      >
        {trucks.map(t =>
          <TruckMarker
            truck={t}
            imageSource={require("../assets/images/truck-icon-png-10.jpg")}
            favoriteImageSource={require("../assets/images/heartblue.png")}
            onPress={() => this.props.app.toggleFavorite(t.id)}
            key={t.title}
          />)}
      </MapView>
    )
  }

  componentWillMount() {
    this._getLocationAsync()
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
  };
}