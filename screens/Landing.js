import React from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Slider,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View
} from "react-native";

import Logo from "../assets/images/Logo.png";
import LogoText from "../assets/images/LogoTextUser.png";

const styles = StyleSheet.create({
  logo: {
    height: 80
  },
  logoText: {
    width: 50
  },
  bigBlue: {
    color: "gray",
    fontWeight: "bold",
    textDecorationLine: "underline",
    fontSize: 20,
    paddingBottom: 8
  },
  inputs: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 3,
    padding: 5,
    margin: 7,
    width: "55%"
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
  subButton: {
    backgroundColor: "gold",
    borderRadius: 3,
    marginTop: 15
  },
  switch: {
    backgroundColor: "yellow"
  }
});

class Landing extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Landing",
    background: "#ffbd59"
  });

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#ffbd59"
        }}
      >
        <Image
          style={{ width: 150, height: 150, marginTop: 40, marginBottom: 8 }}
          source={Logo}
          alt="nope"
        />
        <Image
          style={{ width: "80%", height: 80, marginBottom: 40 }}
          source={LogoText}
          alt="nope"
        />
        <Text style={styles.bigBlue}>Login Below!</Text>
        <TextInput style={styles.inputs} placeholder="Username" />
        <TextInput style={styles.inputs} placeholder="Password" />
        <Text>New User?</Text>
        <View style={styles.subButton}>
          <Button
            title="Submit"
            onPress={() => this.props.navigation.navigate("Home")}
          />
        </View>
      </View>
    );
  }
}

export default Landing;
