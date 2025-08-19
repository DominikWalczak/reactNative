import { Text, View, StyleSheet, FlatList, Image, Pressable} from "react-native";
import { Searchbar } from "react-native-paper";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';


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
  async function fetchMovies(search: string){
    if (!search) return [];
    const response = await fetch(`https://www.omdbapi.com/?apikey=7cb38510&s=${search}`)
    const json = await response.json();
    return json.Search || [];
  }
  function handleResultChange(text: string){
    setResult(text)
  }
  function handleLoopPress(){
    refetch();
  }

  function handleRedirect(id: string){
    router.push({
      pathname: "/details",
      params: { imdbID: id},
    })
  }
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

      <FlatList 
        contentContainerStyle={styles.movie}
        data={data}
        keyExtractor={(item) => item.imdbID}
        renderItem={({ item }) => (
          <Pressable style={styles.movieItem} onPress={() => handleRedirect(item.imdbID)}>
            <Image style={styles.movieItemImage} source={{uri: item.Poster}}/>
            <View style={styles.movieItemView}>
              <Text style={styles.movieItemViewTitle}>Title: {item.Title}</Text>
              <Text style={styles.movieItemViewYear}>Year: {item.Year}</Text>
              <Text style={styles.movieItemViewYear}>imdbID: {item.imdbID}</Text>
            </View>
          </Pressable>
        )}
      />
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
  movieItem: {
    display: "flex",
    flexDirection: "row",
    height: 200,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#e0ecf4",   
    shadowColor: '#000',      
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 1,          
    shadowRadius: 4,           
    elevation: 5,         
  },
  movieItemImage: {
    height: 200,
    width: 120,
  },
  movie: {
    paddingBottom: 20,
  },
  movieItemView: {
    padding: 10,
  },
  movieItemViewTitle: {
    width: 200,
    fontSize: 22,
    marginBottom: 10,
  },
  movieItemViewYear: {

  },
});