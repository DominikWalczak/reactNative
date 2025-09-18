import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PressableOpacity } from 'react-native-pressable-opacity';
import Constants from 'expo-constants';
import { useIsFocused } from "@react-navigation/native";
import { deleteMovie, insertMovie, loadMovies, loadMoviesAndOpinions } from './db/datebase';

export default function Details() {
  const { imdbID } = useLocalSearchParams<{imdbID: string}>();
  const [element, setElement] = useState({});
  const [inList, setInList] = useState(false);
  const [isOpinion, setIsOpinion] = useState(false);
  const [x, setX] = useState<number>(0);

  const isFocused = useIsFocused();
  const { API_KEY } = Constants.expoConfig.extra as { API_KEY: string }; //pobierania klucza API
  
  useEffect(() =>{ //weryfikacja bazy danych aby sprawdzać zmiany (usuwanie oraz dodawanie do obejrzenia)
    renderDateBase();
    if(isFocused && x < 10){
      setX(x => x+1);
    }
    else if(!isFocused){
      setX(x => x = 0);
    }
  }, [x, isFocused]);
  async function renderMovie(search: string) {
    if (!search) return;

    const response = await fetch(`https://api.themoviedb.org/3/movie/${search}?api_key=${API_KEY}&language=en-US&append_to_response=credits`);
    const json = await response.json();
    return json || [];
  }
  async function addMovieToWatch(){ 
    if(imdbID !== element.movie_id){ //imdbID !== element.movie_id//weryfikacja czy film nie został już dodany, 
    // ta część jest powiązana z return komponentu który dostosowuje się do funkcji z else jeśli film został dodany
      await insertMovie(imdbID);
      await renderDateBase();
    }
    else{ // kieruje do opinion
      renderDateBase();
      router.push({
        pathname: "/opinion",
        params: { imdbID: imdbID, isOpinion: isOpinion ? "1" : "0"},
      });
    }    
  }
  async function deleteMovieToWatch(){ //funkcja usuwa film z listy do obejrzenia
    if(imdbID === element.movie_id){
      await deleteMovie(imdbID);
      await renderDateBase();
    }
  }
  async function renderDateBase(){ // wyczytywanie listy z bazy danych 
    const res = await loadMovies();
    const found = res.find((ele: any) => ele.movie_id === imdbID); //weryfikacja czy film jest dodany do obejrzenia
    setElement(found ?? {});
    setInList(Boolean(found));
    if(inList){ // Jeśli jest w liście do obejrzenia to zweryfikuj czy istnieje już opinia
      const res2 = await loadMoviesAndOpinions(imdbID);
      const found2 = res2.find((ele: any) => ele.movie_id === imdbID);
      setIsOpinion(Boolean(found2));
    }
  }
  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ["movie", imdbID],
    queryFn: () => renderMovie(imdbID),
    enabled: true,
  });


  if(!data){
    return <Text>Loading...</Text>
  }
  const topActors = data.credits?.cast // wybór 5 najważniejszych aktorów
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
            <Text style={styles.addMov}>{inList ? ( isOpinion ? "Update your opinion" : "Watched? Add opinion!") : "Add to watch list"}</Text>
            </PressableOpacity>
            {inList &&           
            <PressableOpacity onPress={() => deleteMovieToWatch()} activeOpacity={0.6}>
              <Text style={styles.addMov}>Delete from the list</Text>
            </PressableOpacity>
            }
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