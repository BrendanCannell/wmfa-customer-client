import React, { Component } from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import Modal from "react-native-modal";
import Mega from "../assets/images/mega.png";
import watch from "../assets/images/watch.png";
import testTruck from "../assets/images/truck-icon-png-10.jpg";
import navImg from "../assets/images/navimg.png";
import heartRed from "../assets/images/heart-red.png";

export default class TruckModal extends Component {
  state = {
    isModalVisible: false
  };

  _toggleModal = () =>
    this.setState({ isModalVisible: !this.state.isModalVisible });

  render() {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={this._toggleModal}>
          <Image style={{ height: 25, width: 25 }} source={Mega} />
        </TouchableOpacity>
        <Modal isVisible={this.state.isModalVisible}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              padding: 30
            }}
          >
            <View
              style={{
                flex: 0.85,
                backgroundColor: "#ffde59",
                borderRadius: 10,
                padding: 10,
                justifyContent: "space-between",
                alignContent: "center"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {/* <Image style={{ width: 40, height: 45 }} source={watch} />
                <Text style={{ fontSize: 25 }}>13:35</Text> */}
              </View>

              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 30,
                  marginBottom: -10,
                  fontWeight: "bold"
                }}
              >
                Jorge's Taco's
              </Text>
              <Image
                style={{
                  borderColor: "tomato",
                  borderBottomWidth: 1,
                  borderRadius: 90,
                  borderWidth: 2,
                  alignSelf: "center",
                  height: 180,
                  width: 180
                }}
                source={testTruck}
              />
              <View
                style={{
                  alignSelf: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Image
                  source={heartRed}
                  style={{
                    alignSelf: "center",
                    height: 50,
                    width: 50,
                    marginRight: 7
                  }}
                />
                <Text
                  style={{
                    fontSize: 20,

                    fontWeight: "bold"
                  }}
                >
                  : 342
                </Text>
                <Image
                  source={navImg}
                  style={{
                    alignSelf: "center",
                    marginLeft: 18,
                    marginTop: -3,
                    height: 40,
                    width: 69
                  }}
                />
              </View>
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 25,
                  fontWeight: "bold",
                  textDecorationLine: "underline"
                }}
              >
                Tacos BOGO!
              </Text>
              <Text
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  fontSize: 18
                }}
              >
                With only the freshest ingredients, show the app get 10% off
              </Text>
              <TouchableOpacity
                style={{
                  borderColor: "tomato",
                  borderBottomWidth: 1,
                  borderRadius: "50%",
                  backgroundColor: "tomato",
                  alignItems: "center"
                }}
                onPress={this._toggleModal}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
