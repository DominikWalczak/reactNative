import { Text, View, StyleSheet, FlatList, Image, Pressable} from "react-native";
import { useState, useEffect } from "react";
import { loadMovies } from "../db/datebase";
import RenderList from "../RenderList";
import { useQuery } from '@tanstack/react-query';
import Constants from 'expo-constants';

interface Movie {
  id: number;
  title: string;
  release_date?: string; 
  poster_path: string | null;
}

export default function List(){
    const [watched, setWatched] = useState(false);
    const [dateBase, setDateBase] = useState<Movie[]>([]);
    const [dBase, setdBase] = useState<any[]>([]);
    const [id, setId] = useState(0);
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
    const { API_KEY } = Constants.expoConfig.extra;

    async function renderMovie(search: number) {
        if (!search) return [];
        const response = await fetch(`https://api.themoviedb.org/3/movie/${search}?api_key=${API_KEY}&language=en-US`);
        const json = await response.json();
        return json.results || [];
    }
    const { data, isLoading, isError, refetch} = useQuery({
        queryKey: ["movie", id],
        queryFn: () => renderMovie(id),
        enabled: false,
    });
    function setList(){
        dBase.map((item: any) =>{
            if(watched){
                if(item.watched){
                    setId(item.movie_id);
                    refetch();
                    setDateBase((m) => [...m, data]);
                }
            }
            else{
                if(!item.watched){
                    setId(item.movie_id);
                    refetch();
                    setDateBase((m) => [...m, data]);
                }
            }
        });
    }
    return(
        <View style={styles.view}>
            <Pressable onPress={() => handleWatchedChange()}><Text style={styles.changeBtnd}>{watched ? "Obejrzane" : "Do obejrzenia"}</Text></Pressable>
            <RenderList data={dateBase}/>
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