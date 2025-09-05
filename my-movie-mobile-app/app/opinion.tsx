import { Text, TextInput, View, StyleSheet, ScrollView, Pressable} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { insertOpinion, changeOpinion, loadMoviesAndOpinions } from './db/datebase';

export default function Opinion() {
  const { imdbID } = useLocalSearchParams<{imdbID: string}>();
  const { isOpinion } = useLocalSearchParams<{isOpinion: string}>();
  const [dateBase, setDateBase] = useState<any[]>([]);
  const [opinion, setOpinion] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rate, setRate] = useState("");

  const minMax = z.number().min(1, "Minimum value is 1").max(5, "Maximum value is 5");
  const belowFour = z.number().min(4, "Ratings below 4 need to have opinion and title");
  const textSchema = z.string().trim().min(1, "Cannot be empty");

  useEffect(() => {
    if(Boolean(isOpinion)){
      
    }
  },[]);
  async function listCheck() { //dokończyć
    const re = await loadMoviesAndOpinions(imdbID);
    return re;
  }
  function handleButtonPressed(){
    const re1 = belowFour.safeParse(Number(rate));
    const id = imdbID;
    if(re1.success){
      setOpinion({rate, id, title, desc});
      if(Boolean(isOpinion)){
        changeOpinion(opinion);
        alert("Opinion changed");
        router.back()
        return;
      }
      insertOpinion(opinion);
      alert("Opinion added");
      router.back()
    }
    else{
      const re2 = textSchema.safeParse(title);
      const re3 = textSchema.safeParse(desc);
      if(re2.success && re3.success){
        setOpinion({rate, id, title, desc});
        if(Boolean(isOpinion)){
          changeOpinion(opinion);
          alert("Opinion changed");
          router.back()
          return;
      }
        insertOpinion(opinion);
        alert("Opinion added");
        router.back()
        return;
      }
      alert(re1.error.issues[0].message);
    }
  }
  function handleNumberChange(r: string){
    if (r === "") {
      setRate("");
      return;
    }
    const n = Number(r);

    const result = minMax.safeParse(n);

    if (result.success) {
      setRate(r);
    } else {
      const firstIssue = result.error.issues[0].code;
      if (firstIssue === "too_big") {
        setRate("5");
      } else {
        setRate("1");
      }
  }
  }
  return (
    <ScrollView style={styles.view}>
        <TextInput style={styles.input}  
          placeholder="Title" 
          value={title} 
          multiline
          onChangeText={setTitle}>
        </TextInput>
        <TextInput style={styles.input} 
          placeholder="Description" 
          value={desc}onChangeText={setDesc} 
          multiline>
        </TextInput>
        <TextInput style={styles.input} 
          placeholder="Rating" 
          value={rate} 
          onChangeText={(t) => 
            handleNumberChange(t)} 
            keyboardType="numeric" 
            maxLength={1}>
        </TextInput>
        <Pressable onPress={() => handleButtonPressed()}>
          <Text style={[styles.input, styles.btnd]}>Add opinion!</Text>
        </Pressable>
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
    padding: 10,
    backgroundColor: "#e0ecf4",
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 1,          
    shadowRadius: 4,           
    elevation: 5,   
  },
  btnd: {
    textAlign: "center",
  },
});