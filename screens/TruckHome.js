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

let logo = require("../assets/images/BlueLogo.png");

class TruckHome extends React.Component {
  static navigationOptions = {
    header: null
  };

  render = () => (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: Dimensions.get("window").width,
          height: 10,
          backgroundColor: "#38b6ff"
        }}
      />
    </View>
  );
}

export default connect()(TruckHome);
