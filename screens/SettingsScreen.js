import React from 'react'
import {AsyncStorage, Button, Slider, Switch, Text, View} from 'react-native'
import R from 'ramda'
import {connect} from 'react-redux'
import {set, update} from "../actions"

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Settings"
  })

  render() {
    return (
      <View>
        <Text>Receive Notifications:</Text>
        <Switch
          value={this.props.receiveNotifications}
          onValueChange={switchState => this.props.update([['user', 'local', 'preferences', 'receiveNotifications'], () => switchState])}
        />
        <Text>Notification Distance:</Text>
        <Slider
          minimumValue={1}
          maximumValue={10000}
          value={this.props.notificationDistance}
          onSlidingComplete={n => this.props.update([['user', 'local', 'preferences', 'notificationDistance'], () => n])}
          // onSlidingComplete={n => this.props.set({user: R.assocPath(['local', 'preferences', 'notificationDistance'], n, this.props.state.user)})}
        />
        <Button
          title="Clear Storage"
          onPress={() => AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)}
        />
        <Text>State: {JSON.stringify(this.props.state)}</Text>
      </View>
    )
  }
}

export default connect(
  state => ({
    state,
    ...R.pick(['receiveNotifications', 'notificationDistance'], R.path(['local', 'preferences'], state.user))}),
  {set, update}
)(SettingsScreen)