import { Text, TextInput, View, StyleSheet, ScrollView, Pressable} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { PressableOpacity } from 'react-native-pressable-opacity';
import Constants from 'expo-constants';
import { z } from "zod";
import { deleteMovie, insertMovie, loadMovies } from './db/datebase';

export default function Opinion() {
  const { imdbID } = useLocalSearchParams<{imdbID: string}>();
  const [opinion, setOpinion] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rate, setRate] = useState("");

  const minMax = z.number().min(1, "Minimum value is 1").max(5, "Maximum value is 5");
  function handleNumberChange(r: string){
    // if (r === "") {
    //   setRate("");
    //   return;
    // }
    const n = Number(r);

    const result = minMax.safeParse(n);

    if (result.success) {
      setRate(r);
    } else {
      const firstIssue = result.error.issues[0];
      if (firstIssue.code === "too_big") {
        console.log(result.error);
      }
  }
  }
  return (
    <ScrollView style={styles.view}>
        <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle}></TextInput>
        <TextInput style={styles.input} placeholder="Description" value={desc}onChangeText={setDesc}></TextInput>
        <TextInput style={styles.input} placeholder="Rating" value={rate} onChangeText={(t) => handleNumberChange(t)} keyboardType="numeric" maxLength={1}></TextInput>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: "#8856a7",
  },
  input: {
    fontSize: 20,
    margin: 10,
    padding: 5,
    backgroundColor: "#e0ecf4",
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 1,          
    shadowRadius: 4,           
    elevation: 5,   
  },
});