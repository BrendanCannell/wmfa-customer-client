import React from 'react'

import {
  AppState,
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableHighlight,
  View,
} from 'react-native'

import {connect} from 'react-redux'

import Frisbee from 'frisbee'
import * as R from 'ramda'

import Map from "../components/Map"
import locationInUseGranted from "../util/locationInUseGranted"
import {set} from "../actions"

let logo = require("../assets/images/LogoTextUser.png")

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  render = () =>
    <View style={{flex: 1}}>
      <View style={{width: Dimensions.get('window').width, height: 10, backgroundColor: '#fcbe59'}}/>
      <Image
        source={logo}
        style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width / 506 * 129}}
        // height={Dimensions.get('window').width / 506 * 129}
      />
      <View style={{flex: 1}}>
        {this.props.showMap ? <Map /> : <View />}
        {this.props.notification && this.props.notification.truck &&
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'white',
            opacity: 0.8,
            top: 20, left: 20,
            height: 100,
            width: Dimensions.get('window').width - 40,
            zIndex: 100,
            justifyContent: 'space-evenly'
          }}
        >
          <Text style={{fontSize: 24}}>{this.props.notification.truck.title} is now serving near you!</Text>
          <TouchableHighlight onPress={() => this.props.set({notification: null})}>
            <Text style={{alignSelf: 'center'}}>Ok</Text>
          </TouchableHighlight>
        </View>}
      </View>
    </View>
}

let clearStore = () => AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)

let mapStateToProps = state => ({
  notification: state.notification && {...state.notification, truck: state.trucks[state.notification.data.id]},
  showMap: state.storageLoaded && state.permissions && (state.region || !locationInUseGranted(state.permissions))
})

let mapDispatchToProps = {
  set
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)