import React from 'react';
import { AsyncStorage, Button, Slider, Text, View } from 'react-native';

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    // title: navigation.state.params.title,
    title: "Settings"
  });

  app = this.props.navigation.state.params.app
  
  state = {appState: this.app.state}

  render() {
    return (<View>
      <Text>State: {JSON.stringify(this.state.appState)}</Text>
      <Text>Notification Distance: </Text>
      <Slider
        minimumValue={1}
        maximumValue={10000}
        value={this.state.appState.notificationDistance}
        onSlidingComplete={n => this.app.setState({notificationDistance: n}).then(() => this.setState({appState: this.app.state}))}
      />
      <Button
        title="Clear Storage"
        onPress={() => AsyncStorage.getAllKeys().then(AsyncStorage.multiRemove)}
      />
      </View>
    )
  }
}
