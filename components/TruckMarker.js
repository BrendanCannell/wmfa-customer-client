import React from "react";
import { Button, Image, Text, TouchableOpacity, View } from "react-native";
import { MapView } from "expo";
import R from "ramda";
import TruckModal from "../components/TruckModal";

let icons = R.map(
  source => <Image source={source} style={{ width: 30, height: 30 }} />,
  {
    markerDefault: require("../assets/images/truck-all.png"),
    markerFavorite: require("../assets/images/truck-fav.png"),
    addFavorite: require("../assets/images/heart-gray.png"),
    removeFavorite: require("../assets/images/heart-red.png")
  }
);

export default (TruckMarker = props => {
  let { truck, isFavorite, toggleFavorite } = props,
    [longitude, latitude] = truck.location.coordinates;

  return (
    <MapView.Marker
      coordinate={{ longitude, latitude }}
      title={truck.title}
      tracksInfoWindowChanges={true}
    >
      {icons[isFavorite ? "markerFavorite" : "markerDefault"]}
      <MapView.Callout
        tooltip
        //onPress={toggleFavorite}
        style={{
          padding: 10,
          width: truck.title.length * 8 + 50,
          backgroundColor: "#fcbe59",
          flexDirection: "row",
          borderRadius: 11,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ paddingRight: 13 }}>{truck.title}</Text>
        {icons[isFavorite ? "removeFavorite" : "addFavorite"]}
        <TruckModal />
      </MapView.Callout>
    </MapView.Marker>
  );
});
