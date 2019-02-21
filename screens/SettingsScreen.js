import React from 'react'
import {AsyncStorage, Button, ScrollView, Slider, Switch, Text, View} from 'react-native'
import R from 'ramda'
import {connect} from 'react-redux'
import {set, update} from "../actions"

class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Settings"
  })

  render() {
    return (
      <View style={{flex: 1}}>
        <Text>State:</Text>
        <ScrollView style={{flex: 1}}>
          <Text>{JSON.stringify(this.props.state, null, 2)}</Text>
        </ScrollView>
        <Button
          title="Clear Storage"
          onPress={() => AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)}
        />
      </View>
    )
  }
}

export default connect(
  state => ({
    state,
    ...R.pick(['notificationDistance'], R.path(['local'], state.user))}),
  {set, update}
)(SettingsScreen)