import React from "react";
import {
  AsyncStorage,
  Button,
  Text,
  View,
  StyleSheet,
  AppState,
  Image
} from "react-native";
import { connect } from "react-redux";

import Frisbee from "frisbee";
import * as R from "ramda";

import Map from "../components/Map";
import locationInUseGranted from "../util/locationInUseGranted";
import toggleFavorite from "../actions/toggleFavorite";

import BlueLogo from "../assets/images/BlueLogo.png";
import MapButtons from "../components/MapButtons";

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  render = () =>
    true ? (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "stretch",
            backgroundColor: "#38b6ff",
            paddingTop: 25,
            paddingBottom: 13,
            borderBottomWidth: 2,
            borderBottomColor: "gray"
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Image
              source={BlueLogo}
              style={{
                height: 50,
                width: 250,
                marginLeft: 60,
                padding: 5
              }}
            />
          </View>
          <View
            style={{
              justifyContent: "center"
            }}
          >
            <Button
              overrides={{ color: "white" }}
              title="Settings"
              onPress={() => this.props.navigation.navigate("Settings")}
            />
          </View>
        </View>
        {this.props.showMap ? <Map /> : <View />}
        <MapButtons />
      </View>
    ) : (
      <View />
    );
}

let clearStore = () => AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove);

let mapStateToProps = state => ({
  showMap:
    state.storageLoaded &&
    state.permissions &&
    (state.region || !locationInUseGranted(state.permissions))
});

let mapDispatchToProps = {
  toggleFavorite
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
