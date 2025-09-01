import { Text, View, StyleSheet, FlatList, Image, Pressable} from "react-native";
import { Searchbar } from "react-native-paper";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import RenderList from "../RenderList";

export default function Index() {

  const [result, setResult] = useState("");

  // useEffect(() =>{
  //   handleLoopPress();
  // }, []);
  // function handleLoopPress(){
  //   fetch(`https://www.omdbapi.com/?apikey=7cb38510&s=${result}`)
  //     .then(response => response.json())
  //     .then(json => {
  //       setData(json.Search);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }

 const { API_KEY } = Constants.expoConfig.extra;

  async function fetchMovies(search: string){
    if (!search) return [];
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}&api_key=${API_KEY}`);
    const json = await response.json();
    return json.results || [];
  }
  function handleResultChange(text: string){
    setResult(text)
  }
  function handleLoopPress(){
    refetch();
  }

  // function handleRedirect(id: string){
  //   router.push({
  //     pathname: "/details",
  //     params: { imdbID: id},
  //   })
  // }
  const { data, isLoading, isError, refetch} = useQuery({
    queryKey: ["movies", result],
    queryFn: () => fetchMovies(result),
    enabled: false,
  });
  return (
    <View style={styles.view}> 
      <View style={styles.searchView} >
        <Searchbar
          style={styles.search} 
          placeholder="Search"
          onChangeText={handleResultChange}
          value={result}
          returnKeyType="search"
          onSubmitEditing={handleLoopPress}
        />
      </View>

      {isLoading && <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>}
      {isError && <Text style={{ textAlign: "center", marginTop: 20 }}>Error loading data.</Text>}

      <RenderList data={data}/>
    </View>
  );

}

const styles = StyleSheet.create({
  search: {
    marginLeft: 2,
    marginRight: 2,
    backgroundColor: "#e0ecf4",
  },
  searchView: {
    marginTop: 10,
    borderRadius: 100,
    overflow: "hidden",
    shadowColor: '#000',      
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 1,          
    shadowRadius: 4,           
    elevation: 5,        
  },
  view: {
    flex: 1,
    marginTop: 35,
    backgroundColor: "#8856a7",
  },
});