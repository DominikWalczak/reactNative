import { Text, View, StyleSheet, FlatList, Image, Pressable} from "react-native";
import { useState } from "react";

export default function List(){
    const [watched, setWatched] = useState(false);

    function handleWatchedChange(){
        setWatched(!watched);
    }


    return(
        <View>
            <Pressable onPress={() => handleWatchedChange}>Lista: {watched ? "Obejrzane" : "Do obejrzenia"}</Pressable>
            <FlatList 
                data={}
                keyExtractor={(item => item.id)}
                renderItem={({ item }) => (
                    
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
})