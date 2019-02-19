import React from 'react'

import {
  AsyncStorage,
  Button,
  Text,
  View,
  AppState,
} from 'react-native'

import {connect} from 'react-redux'

import Frisbee from 'frisbee'
import * as R from 'ramda'

import Map from "../components/Map"
import locationInUseGranted from "../util/locationInUseGranted"
import toggleFavorite from "../actions/toggleFavorite"

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render = () => true ?
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'stretch'}}>
        <View style={{flex: 1, justifyContent: 'center', borderWidth: 2}}>
          <Text style={{color: 'white', fontSize: 48, textAlign: 'center', textAlignVertical: 'center'}}>WMFA!?</Text>
        </View>
        <View style={{justifyContent: 'center', borderWidth: 2}}>
          <Button
            title="Settings"
            onPress={() => this.props.navigation.navigate("Settings")}
          />
        </View>
      </View>
      {this.props.showMap ? <Map /> : <View />}
    </View>
    : <View />
}

let clearStore = () => AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)

let mapStateToProps = state => ({
  showMap: state.storageLoaded && state.permissions && (state.region || !locationInUseGranted(state.permissions))
})

let mapDispatchToProps = {
  toggleFavorite
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeScreen)