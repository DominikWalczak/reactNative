import { Text, View, StyleSheet, FlatList, Image, Pressable} from "react-native";
import { useState } from "react";
import db from "../db/datebase";

export default function List(){
    const [watched, setWatched] = useState(false);
    const [db, setDb] = useState();
    function handleWatchedChange(){
        setWatched(!watched);
    }

    function watchedOrToWatch(){
        if(watched){
            // setDb(); watched
        }
        else{
            // setDb(); to watch
        }
    }

    return(
        <View style={styles.view}>
            <Pressable onPress={() => handleWatchedChange()}><Text>Lista: {watched ? "Obejrzane" : "Do obejrzenia"}</Text></Pressable>
            <FlatList 
                data={db}
                keyExtractor={(item => item.id)}
                renderItem={({ item }) => (
                    <Pressable style={styles.movieItem}>
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
    )
}
const styles = StyleSheet.create({
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
})