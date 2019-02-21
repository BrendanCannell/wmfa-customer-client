import React from "react";
import {
  AsyncStorage,
  Button,
  Slider,
  StyleSheet,
  Switch,
  Text,
  View
} from "react-native";
import R from "ramda";
import { connect } from "react-redux";
import { set, update } from "../actions";

const styles = StyleSheet.create({
  bigBlue: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 20,
    alignItems: "center"
  },
  MommaDiv: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    color: "blue",
    fontWeight: "bold",
    fontSize: 30,
    borderColor: "black",
    borderWidth: 1,
    padding: 50
  },
  switch: {
    backgroundColor: "yellow"
  }
});

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Settings"
  });

  render() {
    return (
      <View>
        <View style={{ height: 50 }} />

        <Text style={styles.bigBlue}>Receive Notifications:</Text>
        <Switch
          style={styles.switch}
          value={this.props.receiveNotifications}
          onValueChange={switchState =>
            this.props.update([
              ["user", "local", "preferences", "receiveNotifications"],
              () => switchState
            ])
          }
        />
        <Text>Notification Distance:</Text>
        <Slider
          minimumValue={1}
          maximumValue={10000}
          value={this.props.notificationDistance}
          onSlidingComplete={n =>
            this.props.update([
              ["user", "local", "preferences", "notificationDistance"],
              () => n
            ])
          }
          // onSlidingComplete={n => this.props.set({user: R.assocPath(['local', 'preferences', 'notificationDistance'], n, this.props.state.user)})}
        />
        <Button
          title="Clear Storage"
          onPress={() =>
            AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)
          }
        />
        <Text>State: {JSON.stringify(this.props.state)}</Text>

        <Button
          style={{
            width: 50,
            justifyContent: "center",
            borderColor: "black",
            borderWidth: 2
          }}
          title="Sign out"
          onPress={() => this.props.navigation.navigate("Landing")}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    state,
    ...R.pick(
      ["receiveNotifications", "notificationDistance"],
      R.path(["local", "preferences"], state.user)
    )
  }),
  { set, update }
)(SettingsScreen);
