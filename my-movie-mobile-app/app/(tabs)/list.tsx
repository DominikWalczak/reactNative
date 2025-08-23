import { Text, View, StyleSheet, FlatList, Image, Pressable} from "react-native";
import { use, useState } from "react";

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
            {/* <FlatList 
                data={}
                keyExtractor={(item => item.id)}
                renderItem={({ item }) => (
                    
                )}
            /> */}
        </View>
    )
}
const styles = StyleSheet.create({
    view: {
        flex: 1,
        marginTop: 35,
        backgroundColor: "#8856a7",
  },
})