import { Text, View, StyleSheet, FlatList, Image, Pressable} from "react-native";
import { useState, useEffect } from "react";
import { loadMovies } from "../db/datebase";
import RenderList from "../RenderList";
import { useQueries } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { Movie } from "../RenderList";

export default function List(){
    const [watched, setWatched] = useState(false);
    const [dateBase, setDateBase] = useState({});
    const [watchedDateBase, setWatchedDateBase] = useState({});
    const [dBase, setdBase] = useState<object[]>([]);
    const [id, setId] = useState("");
    function handleWatchedChange(){
        setWatched(!watched);
    }
    useEffect(() =>{
        const f = async () =>{
            const movies = await loadMovies();
            setdBase(movies);
        };
        f();
        setList();
    }, []);
    const { API_KEY } = Constants.expoConfig.extra as { API_KEY: string };

    async function renderMovie(id: string, apiKey: string) {
    const res = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
    );
    if (!res.ok) throw new Error("Failed to fetch movie");
    return res.json();
    }
    const movieQueries = useQueries({
        queries: dBase.map((row) => ({
        queryKey: ["movie", row.movie_id],
        queryFn: () => renderMovie(row.movie_id, API_KEY),
        })),
    });
    function setList(){ // generowanie danych zapisanach filmów z API, dzieląc je na do obejrzenia i obejrzane
        const movieSearch = movieQueries
            .map((q, idx) => {
                if (!q.data) return null;
                const row = dBase[idx];
                return { ...q.data, watched: row.watched } as Movie & { watched: boolean };
            })
        const watchedMovies = movieSearch.filter((m: any) => m.watched); 
        const unwatchedMovies = movieSearch.filter((m: any) => !m.watched);
        setDateBase(unwatchedMovies);
        setWatchedDateBase(watchedMovies);
    }
    
    if(){
        return(
            <View>
                <Text>Loading...</Text>
            </View>

        )
    }
    return(
        <View style={styles.view}>
            <Pressable onPress={() => handleWatchedChange()}><Text style={styles.changeBtnd}>{watched ? "Obejrzane" : "Do obejrzenia"}</Text></Pressable>
            <RenderList data={watched ? watchedDateBase : dateBase}/>
        </View>
    )
}
const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop: 35,
        backgroundColor: "#8856a7",
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 1,          
        shadowRadius: 4,           
        elevation: 5,    
  },
    changeBtnd:{
       backgroundColor: "#e0ecf4",
       padding: 15, 
       margin: 10,
       width: "40%",
       textAlign: "center",
       borderRadius: 40,
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
})