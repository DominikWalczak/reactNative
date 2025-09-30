import { Text, View, StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import 'react-native-reanimated';
import { useState } from "react";
import { useInfiniteQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';
import RenderList from "../RenderList";
import { Movie } from "../RenderList";


export default function Index() {

  const [result, setResult] = useState("");
  const API_KEY = Constants.expoConfig?.extra?.API_KEY ?? "";
  const HTTPS_DIRECTION = Constants.expoConfig?.extra?.HTTPS_DIRECTION ?? "";

  async function fetchMovies({pageParam = 1, queryKey}: any){
    try{
        const [_key, search] = queryKey;
        if (!search) return { results: [], page: 1, total_pages: 1 };
        const response = await fetch(`${HTTPS_DIRECTION}search/movie?query=${encodeURIComponent(search)}&api_key=${API_KEY}&page=${pageParam}`);
        if(!response.ok) return [];
        return response.json() || [];
      }
      catch(error){
        console.error(`fetchMovies Error: ${error}`);
        return [];
      }
  }
  function handleResultChange(text: string){
    setResult(text);
  }
  function handleLoopPress(){
    refetch();
  }
  const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch} = useInfiniteQuery({
    queryKey: ["movies", result],
    queryFn: fetchMovies,
    initialPageParam: 1,
    enabled: false,
    getNextPageParam: (lastPage: any) =>
    lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  const movies: Movie[] = data
    ? data.pages.flatMap((page: any) => page.results)
    : [];

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

      <RenderList data={movies} loadMore={() => {if (hasNextPage) fetchNextPage();}}/>
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