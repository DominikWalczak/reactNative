import { Text, TextInput, View, StyleSheet, ScrollView, Pressable} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { insertOpinion, changeOpinion, loadMoviesAndOpinions } from './db/datebase';

export default function Opinion() {
  const { imdbID } = useLocalSearchParams<{imdbID: string}>();
  const { isOpinion } = useLocalSearchParams<{isOpinion: string}>();
  const [opinion, setOpinion] = useState({});
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rate, setRate] = useState("");

  const minMax = z.number().min(1, "Minimum value is 1").max(5, "Maximum value is 5"); 
  // wybrałem number().min().max() aby móc zweryfikować czy podana wartość znajduje się w przedziale 1-5, 
  // jeśli nie to na podstawie komunikatów błędów zod poprawiam liczbę do najwyższej/najniższej skrajnej wartości
  const belowFour = z.number().min(4, "Ratings below 4 need to have opinion and title");
  // wybrałem number().min() aby móc zweryfikować czy rating jest poniżej 4, 
  // jeśli nie jest to na podstawie komunikatu błędu zod uruchamiana jest część kodu gdzie weryfikowana jest zawartość desc i title
  const textSchema = z.string().trim().min(1, "Cannot be empty");
  // wybrałem string().trim().min() aby móc zweryfikować czy podany string w desc i title jest pusty oraz czy nie składa się z samych spacji

  useEffect(() => { //useEffect sprawdza czy zaaktualizowano bazę danych i narzuca zmiany do zmiennych title, desc i rate, 
  // umożliwia to zaczynanie edycji od momentu w którym użytkownik ją zostawił, a nie od początku
    if(Boolean(isOpinion)){
      listCheck();
    }
  },[]);
  async function listCheck() { //pobieranie istniejącej opinii w celu edycji
    const re = await loadMoviesAndOpinions(imdbID);
    setTitle(re.opinion_title);
    setDesc(re.opinion_desc);
    setRate(re.opinion_rate);
  }
  function handleButtonPressed(){
    const re1 = belowFour.safeParse(Number(rate));
    const id = imdbID;
    if(re1.success){
      setOpinion({rate, id, title, desc});
      console.log(opinion);
      console.log(Boolean(isOpinion));
      console.log(isOpinion);
      if(isOpinion === "1"){ //sprawdzanie na podstawie boola z details czy opinia już istnieje
        changeOpinion(opinion);
        alert("Opinion changed");
        router.back()
        return;
      }
      insertOpinion(opinion); //jeśli nie ma jeszcze opinii to zostanie wykonane dodanie jej
      alert("Opinion added");
      router.back()
    }
    else{
      const re2 = textSchema.safeParse(title);
      const re3 = textSchema.safeParse(desc);
      if(re2.success && re3.success){ //weryfikacja czy title i desc są przynajmniej długości 1 znaku
        setOpinion({rate, id, title, desc});
        console.log(rate); 
        console.log(id); 
        console.log(title); 
        console.log(desc); 
        console.log(opinion); 
        console.log(Boolean(isOpinion));
        console.log(isOpinion);
        if(isOpinion === "1"){ //sprawdzanie na podstawie boola z details czy opinia już istnieje
          changeOpinion({rate, id, title, desc});
          alert("Opinion changed");
          router.back()
          return;
      }
        insertOpinion({rate, id, title, desc}); //jeśli nie ma jeszcze opinii to zostanie wykonane dodanie jej
        alert("Opinion added");
        router.back()
        return;
      }
      alert(re1.error.issues[0].message);
    }
  }
  function handleNumberChange(r: string){
    if (r === "") { // jeśli użytkownik usunie wartość z rate to zmienia się ona na pusty string, 
    // inaczej pusty string był uznawany za wartość poniżej 1 i wstawiano od razu 1 uniemożliwiając skorygowanie ratingu 
      setRate("");
      return;
    }
    const n = Number(r);

    const result = minMax.safeParse(n);

    if (result.success) { //Jeśli liczba mieści się między 1, a 5 
      setRate(r);
    } else {
      const firstIssue = result.error.issues[0].code;
      if (firstIssue === "too_big") { // jeśli za duży rating, ustaw 5
        setRate("5");
      } else { // jeśli za mały rating, ustaw 1
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