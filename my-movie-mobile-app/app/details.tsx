import { Text, View, StyleSheet, Image, ScrollView, Pressable} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PressableOpacity } from 'react-native-pressable-opacity';
import Constants from 'expo-constants';
import { z } from "zod";
import { deleteMovie, insertMovie, loadMovies } from './db/datebase';

export default function Details() {
  const { imdbID } = useLocalSearchParams<{imdbID: string}>();
  const [dateBase, setDateBase] = useState<any[]>([]);
  const [element, setElement] = useState({});
  const [inList, setInList] = useState(true);

  const { API_KEY } = Constants.expoConfig.extra as { API_KEY: string };
  useEffect(() =>{
    renderDateBase();
  }, []);
  async function renderMovie(search: string) {
    if (!search) return;

    const response = await fetch(`https://api.themoviedb.org/3/movie/${search}?api_key=${API_KEY}&language=en-US&append_to_response=credits`);
    const json = await response.json();
    return json || [];
  }
  async function addMovieToWatch(){
    if(false){ //imdbID !== element.movie_id
      console.log("Adding movie:", imdbID);
      await insertMovie(imdbID);
      await renderDateBase();
      console.log("Movie added, reloaded db");
    }
    else{
      router.push({
        pathname: "/opinion",
        params: { imdbID: imdbID},
      });
    }    
  }
  async function deleteMovieToWatch(){
    if(imdbID === element.movie_id){
      await deleteMovie(imdbID);
    }
  }
  async function renderDateBase(){
    console.log("Adding movie235:", imdbID);
    const res = await loadMovies();
    console.log("Adding movie3:", imdbID);
    setDateBase(res);
    const found = res.find((ele: any) => ele.movie_id === imdbID);
    setElement(found ?? {});
    setInList(Boolean(found));
  }
  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ["movie", imdbID],
    queryFn: () => renderMovie(imdbID),
    enabled: true,
  });


  if(!data && !dateBase.length){
    return <Text>Loading...</Text>
  }
  const topActors = data.credits?.cast
    ?.sort((a: any, b: any) => a.order - b.order)
    .slice(0, 5) || [];

  const director = data.credits?.crew.find((c: any) => c.job === "Director");
  return (
    <ScrollView style={styles.view}>
        <Text style={styles.movieText}>{data.title}</Text>
        <View style={styles.movieImageView}>
          <Image style={styles.movieImage} source={{uri: `https://image.tmdb.org/t/p/w500${data.poster_path}`}} alt="No image"/>
        </View>
        <View style={styles.movieView}>
          <View style={styles.movieButtons}>
            <PressableOpacity onPress={() => addMovieToWatch()} activeOpacity={0.6}>
            <Text style={styles.addMov}>{inList ? "Obejrzane? Dodaj recenzje!" : "Dodaj do obejrzenia"}</Text>
            </PressableOpacity>
            {inList &&           
            <PressableOpacity onPress={() => deleteMovieToWatch()} activeOpacity={0.6}>
              <Text style={styles.addMov}>Usuń z listy</Text>
            </PressableOpacity>}
          </View>
          <View style={styles.movieView2}>
            <View>
              <Text style={styles.movieViewText2}>Year: {data.release_date}</Text>
              <Text style={styles.movieViewText2}>Runtime: {data.runtime}</Text>
            </View>
            <View>
              <Text style={styles.movieViewText2}>imdbID: {imdbID}</Text>
              <Text style={styles.movieViewText2}>Ratings: {data.vote_average}</Text>
            </View>
          </View>
          <Text style={styles.movieViewText}>{data.overview}</Text>
          <Text style={styles.movieViewText2}>Genre: {data.genres.map((genre: any) => genre.name).join(', ')}</Text>
          <Text style={styles.movieViewText2}>Director: {director?.name || "No data"}</Text>
          <Text style={styles.movieViewText2}>Actors: {topActors.map((actor: any) => actor.name).join(', ')}</Text>
          <Text style={styles.movieViewText2}>Origin Country: {data.origin_country}</Text>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#8856a7",
  },
  addMov: {
    padding: 10,
    backgroundColor: "#8856a7",
    borderRadius: 40,
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 1,          
    shadowRadius: 4,           
    elevation: 5,     
    textAlign: "center", 
    color: "white",
    fontSize: 15,
  },
  movieImageView: {
    justifyContent: "center",
    alignItems: "center",
  },
  movieImage: {
    height: 400,
    width: 250,
    borderRadius: 30,
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 1,          
    shadowRadius: 4,           
    elevation: 5,         
  },
  movieText: {
    fontSize: 30,
    margin: 10,
    padding: 5,
    backgroundColor: "#e0ecf4",
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 1,          
    shadowRadius: 4,           
    elevation: 5,         
  },
  movieView: {
    margin: 10,
    marginBottom: 50,
    backgroundColor: "#e0ecf4",
    padding: 5,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 1,          
    shadowRadius: 4,           
    elevation: 5,   
  },
  movieViewText: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  movieView2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20, 
  },
  movieViewText2: {
    fontSize: 18,
    marginBottom: 5, 
  },
  movieButtons:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  }
});