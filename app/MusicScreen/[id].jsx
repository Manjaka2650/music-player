import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import { View, Text, StyleSheet } from "react-native";
import { getAllAudio } from "../../components/function";
import * as MediaLibrary from "expo-media-library";
import { DStyle } from "../Home";

export default function MusicScreen() {
  const { id } = useLocalSearchParams();
  const [allMusic, setAllMusic] = useState([]);
  useEffect(() => {
    getAllAudio(setAllMusic, MediaLibrary);
  }, []);

  return (
    <View>
      <Text>MusicScreen</Text>
      <View style={[DStyle.flexCol, { justifyContent: "space-between" }]}>
        <View>
          <Text>Top</Text>
        </View>
        <View>
          <Text>Play</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({});
