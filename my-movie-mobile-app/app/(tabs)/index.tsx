import { Text, View, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import 'react-native-reanimated';
import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import RenderList from "../RenderList";
import { Movie } from "../RenderList";


export default function Index() {

  const [result, setResult] = useState("");
  const [page, setPage] = useState(0);
  const API_KEY = Constants.expoConfig?.extra?.API_KEY ?? "";
  const HTTPS_DIRECTION = Constants.expoConfig?.extra?.HTTPS_DIRECTION ?? "";

  async function fetchMovies(search: string){
    if (!search) return [];
    try{
      const allMovies: Movie[] = [];
      for (let p = 1; p <= page; p++){
        const response = await fetch(`${HTTPS_DIRECTION}search/movie?query=${encodeURIComponent(search)}&api_key=${API_KEY}&page=${p}`);
        if(!response.ok) return [];
        const json = await response.json();
        const newPage = (json.results || []).filter(
          (movie: Movie) => !allMovies.some(prevMovie => prevMovie.id === movie.id));
          allMovies.push(...newPage);
        if(p === page){
          console.log(p);
          console.log(allMovies);
          return allMovies || [];
        }
      }
      
    }
    catch(error){
      console.error(`fetchMovies Error: ${error}`);
      return [];
    }
  }
  function loadMoreMovies(){
    setPage(p => p + 1);
    refetch()
  }
  function handleResultChange(text: string){
    setResult(text);
  }
  function handleLoopPress(){
    refetch();
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

      <RenderList data={data ?? []} loadMore={loadMoreMovies}/>
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