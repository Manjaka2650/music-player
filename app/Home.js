import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/FontAwesome5";
// import { Link } from "expo-router";
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from "expo-av";
import * as MediaLibrary from "expo-media-library";
import { getAllAudio } from "../components/function";
// music player

const Home = () => {
  const configureAudio = async () => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeAndroid: InterruptionModeIOS.DoNotMix,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      shouldDuckAndroid: false,
    });
  };

  useEffect(() => {
    configureAudio();
  }, []);
  const [allAudio, setAllAudio] = useState([]);
  const [isplaying, setisPlaying] = useState(false);
  const [played, setisPlayed] = useState(null);
  const [sound, setSound] = useState(null);
  const [duration, setDuration] = useState(0);
  const [position, setposition] = useState(0);
  const [index, setIndex] = useState(0);

  const [playbackStatus, setPlaybackStatus] = useState(null);

  const playAudio = async (music) => {
    // console.log(music);
    if (!music) return;
    if (sound && played.id == music.id) {
      await sound.playAsync();
      setisPlayed(music);
      setisPlaying(true);
      // setDuration(duration)
    } else if (sound && played.id != music.id) {
      await sound.unloadAsync();
      await getNewSong(music);
    } else if (!sound) {
      await getNewSong(music);
    }
  };

  const getNewSong = async (music) => {
    const { sound: newSound, status } = await Audio.Sound.createAsync(
      {
        uri: music.uri,
      },
      { shouldPlay: true }
    );
    newSound.setOnPlaybackStatusUpdate(handleSetOnPlaybackStatusUpdate);

    setSound(newSound);
    setTimeout(() => handleSetOnPlaybackStatusUpdate(status), 1000);
    setisPlaying(true);
    setisPlayed(music);
    setDuration(status.durationMillis);
    // console.log("play ...");
    await newSound.playAsync();
  };
  const handleSetOnPlaybackStatusUpdate = (status) => {
    console.log(duration);
    if (status.isLoaded) {
      console.log("playing status : ... ", status.isPlaying);
      // setposition(status.positionMillis);

      // console.log("position milli second", status.positionMillis);
      if (status.didJustFinish) {
        const nextindex = index + 1;
        playAudio(allAudio[nextindex]);
      }
    } else if (status.isPlaying) {
      console.log("playing status");
    } else {
      console.log("playback not loaded");
    }
  };

  const formattime = (d) => {
    const minute = Math.floor(d / 60000);
    const second = ((d % 60000) / 1000).toFixed(0);
    return `${minute}:${second < 10 ? "0" : ""}${second}`;
  };
  const nextMusic = () => {
    if (index < allAudio.length - 1) {
      const newIndex = index + 1;
      setIndex(newIndex);
      playAudio(allAudio[newIndex]);
    }
  };
  const prevMusic = () => {
    if (index > 0) {
      const newIndex = index - 1;
      setIndex(newIndex);
      playAudio(allAudio[newIndex]);
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setisPlaying(false);
    }
  };
  useEffect(() => {
    getAllAudio(setAllAudio, MediaLibrary);
  }, []);

  useEffect(() => {
    // configureAudio();
    return sound
      ? () => {
          console.log("unload async");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const playingtimer = () => {
    if (!isplaying) return;
    if (isplaying && duration > 0) {
      const newDuration = duration - 1000;
      setDuration(newDuration);
    }
  };
  useEffect(() => {
    setTimeout(playingtimer, 1000);
  }, [duration, sound && sound.isPlaying]);
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="headset" size={40} color="black" />
          <Text style={styles.headerText}>Music Player</Text>
        </View>
      </View>
      <ScrollView style={styles.scrollStyle1}>
        {allAudio.length !== 0 ? (
          allAudio.map((value, i) => (
            <View key={i} style={styles.boxmessage1}>
              <MusicView
                onplay={() => {
                  setIndex(i);
                  playAudio(value);
                }}
                name={value.filename}
                author={"manjaka"}
                music={value}
                time={formattime(value.duration * 1000)}
              />
            </View>
          ))
        ) : (
          <Text>Pas encore d'audio</Text>
        )}

        {/* {musicData.map((value, index) => (
          <View key={index} style={styles.boxmessage1}>
            <MusicView
              name={value.name}
              author={value.author}
              time={value.duree}
            />
          </View>
        ))} */}
      </ScrollView>
      {/* music play */}
      <Text>{"" + isplaying}</Text>
      {played && (
        <View
          style={[
            DStyle.flexRow,
            { justifyContent: "space-between", padding: "20" },
          ]}
        >
          <Text style={{}}>{played.filename.slice(0, 40)} ...</Text>
          <Text>{formattime(duration)}</Text>
        </View>
      )}
      <View
        style={[
          DStyle.flexRow,
          styles.playbar,
          {
            width: "100%",
            justifyContent: "space-between",
            padding: 20,
            backgroundColor: "white",
            height: 70,
            alignContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Pressable
          // style={{ width: 40, height: 40, backgroundColor: "black" }}
          onPress={prevMusic}
        >
          <Text>
            <Ionicons name="play-skip-back" size={24} color={"black"} />
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            sound && isplaying ? pauseAudio() : playAudio(played);
          }}
        >
          <Text>
            <Icon
              name={!isplaying ? "play" : "pause"}
              // name={"p"}
              size={25}
              color="black"
            />
          </Text>
        </Pressable>
        <Pressable onPress={nextMusic}>
          <Text>
            <Ionicons name="play-skip-forward" size={24} color={"black"} />
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;

const MusicView = ({ name, author, music, time, onplay }) => {
  return (
    <View style={[DStyle.flexRow, { justifyContent: "space-between" }]}>
      <Pressable style={[styles.option, { width: "90%" }]} onPress={onplay}>
        <View
          style={[
            DStyle.flexRow,
            {
              alignContent: "center",
              alignItems: "center",
              gap: 14,
              justifyContent: "center",
            },
          ]}
        >
          {/* <Icon name="bookmark" size={40} color="purple" solid /> */}
          <Feather name="bookmark" size={30} color="black" />
          <View style={[DStyle.flexCol, { gap: 5 }]}>
            <Text style={styles.optionText}>{name.slice(0, 20)}</Text>
            <Text
              style={{ alignSelf: "baseline", fontSize: 12, color: "black" }}
            >
              {time}
            </Text>
          </View>
        </View>
      </Pressable>
      <Pressable
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          padding: 14,
        }}
        onPress={() => alert("Manjaka Hasina no anarako")}
      >
        <Icon name="ellipsis-v" size={20} color="black" />
      </Pressable>
    </View>
  );
};

export const DStyle = StyleSheet.create({
  flexCol: { display: "flex", flexDirection: "column" },
  flexRow: { display: "flex", flexDirection: "row" },
});
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
  },

  header: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  headerContent: {
    display: "flex",
    gap: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  scrollStyle1: {
    flex: 1,
    gap: 10,
    backgroundColor: "whitesmoke",
  },
  scrollStyle: {
    gap: 10,
    backgroundColor: "white",
  },
  boxmessage1: {
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    marginTop: 7,
    marginLeft: 7,
    marginRight: 7,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  boxmessage: {
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    margin: 15,
    display: "flex",
    flexDirection: "row",
  },
  boldtext: {
    fontWeight: "bold",
  },
  nav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  option: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
    alignContent: "center",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  playbar: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
