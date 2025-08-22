import { Text, View, StyleSheet, Image, ScrollView, Pressable} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PressableOpacity } from 'react-native-pressable-opacity';

export default function Details() {
  const { imdbID } = useLocalSearchParams<{imdbID: string}>();
  // useEffect(() => {
  //   if (!imdbID) return;

  //   fetch(`https://www.omdbapi.com/?apikey=7cb38510&i=${imdbID}`)
  //     .then(response => response.json())
  //     .then(json => {
  //       setData(json);
  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  // }, [imdbID]);

  async function renderMovie(search: string) {
    if (!imdbID) return;

    const response = await fetch(`https://www.omdbapi.com/?apikey=7cb38510&i=${search}`)
    const json = await response.json();
    return json || [];
  }

  function addMovieToWatch(){
    
  }

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ["movie", imdbID],
    queryFn: () => renderMovie(imdbID),
    enabled: true,
  });

  if(!data){
    return <Text>Loading...</Text>
  }
  return (
    <ScrollView style={styles.view}>
        <Text style={styles.movieText}>{data.Title}</Text>
        <View style={styles.movieImageView}>
          <Image style={styles.movieImage} source={{uri: data.Poster}}/>
        </View>
        <View style={styles.movieView}>
          <PressableOpacity onPress={() => addMovieToWatch()} activeOpacity={0.6}>
            <Text>Dodaj do obejrzenia</Text>
          </PressableOpacity>
          <View style={styles.movieView2}>
            <View>
              <Text style={styles.movieViewText2}>Year: {data.Year}</Text>
              <Text style={styles.movieViewText2}>Runtime: {data.Runtime}</Text>
            </View>
            <View>
              <Text style={styles.movieViewText2}>imdbID: {imdbID}</Text>
              <Text style={styles.movieViewText2}>Ratings: {data.Ratings[0].Value}</Text>
            </View>
          </View>
          <Text style={styles.movieViewText}>{data.Plot}</Text>
          <Text style={styles.movieViewText2}>Genre: {data.Genre}</Text>
          <Text style={styles.movieViewText2}>Director: {data.Director}</Text>
          <Text style={styles.movieViewText2}>Actors: {data.Actors}</Text>
          <Text style={styles.movieViewText2}>Country: {data.Country}</Text>
          <Text style={styles.movieViewText2}>Awards: {data.Awards}</Text>
        </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    backgroundColor: "#8856a7",
  },
  movieImageView: {
    justifyContent: "center",
    alignItems: "center"
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
});