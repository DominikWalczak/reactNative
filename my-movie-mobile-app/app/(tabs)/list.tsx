import { Text, View, StyleSheet, FlatList, Image, Pressable} from "react-native";
import { useState } from "react";
import db from "../db/datebase";
import RenderList from "../RenderList";

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
            <Pressable onPress={() => handleWatchedChange()}><Text style={styles.changeBtnd}>{watched ? "Obejrzane" : "Do obejrzenia"}</Text></Pressable>
            {/* <RenderList data={data}/> ustawić bramkę logiczną rodzielającą watched/toWatch */}
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