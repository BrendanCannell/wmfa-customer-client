import React from "react";

import {
  AppState,
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableHighlight,
  View
} from "react-native";

import { connect } from "react-redux";

import Frisbee from "frisbee";
import * as R from "ramda";

import Map from "../components/Map";
import locationInUseGranted from "../util/locationInUseGranted";
import { set } from "../actions";
import MapButtons from "../components/MapButtons";

let logo = require("../assets/images/BlueLogo.png");

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render = () => (
    <View style={{ flex: 1 }}>
      {/* <View
        style={{
          width: Dimensions.get("window").width,
          height: 10,
          backgroundColor: "#38b6ff"
        }}
      /> */}
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 0.9,
            padding: 20,
            paddingTop: 23,
            paddingBottom: 12,
            backgroundColor: "#38b6ff"
          }}
        >
          <Image
            source={logo}
            style={{
              width: null,
              height: 65
              // height={Dimensions.get('window').width / 506 * 129}
            }}
          />
        </View>
        <View
          style={{
            flex: 0.1,
            justifyContent: "center",
            paddingRight: 20,
            marginLeft: -10,
            marginBottom: -8,
            backgroundColor: "#38b6ff"
          }}
        >
          <Button
            style={{ fontSize: 20 }}
            overrides={{ color: "#38b6ff" }}
            title="⚙️"
            onPress={() => this.props.navigation.navigate("Settings")}
          />
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {this.props.showMap ? <Map /> : <View />}
        {this.props.notification && this.props.notification.truck && (
          <View
            style={{
              position: "absolute",
              backgroundColor: "white",
              opacity: 0.8,
              top: 20,
              left: 20,
              height: 100,
              width: Dimensions.get("window").width - 40,
              zIndex: 100,
              justifyContent: "space-evenly"
            }}
          >
            <Text style={{ fontSize: 24 }}>
              {this.props.notification.truck.title} is now serving near you!
            </Text>
            <TouchableHighlight
              onPress={() => this.props.set({ notification: null })}
            >
              <Text style={{ alignSelf: "center" }}>Ok</Text>
            </TouchableHighlight>
          </View>
        )}
      </View>
      <MapButtons />
    </View>
  );
}

let clearStore = () => AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);

let mapStateToProps = state => ({
  notification: state.notification && {
    ...state.notification,
    truck: state.trucks[state.notification.data.id]
  },
  showMap:
    state.storageLoaded &&
    state.permissions &&
    (state.region || !locationInUseGranted(state.permissions))
});

let mapDispatchToProps = {
  set
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
