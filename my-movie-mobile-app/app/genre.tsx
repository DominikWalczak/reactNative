import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import Constants from 'expo-constants';
import RenderList from "./RenderList";

export default function Genre(){
    const { genreId } = useLocalSearchParams<{genreId: string}>();
    const { API_KEY } = Constants.expoConfig.extra as { API_KEY: string };

    async function genreFetch(genId: string) {
        if(!genId) return;

        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
        const json = await response.json();
        return json.results || [];
    }

    const { data, isLoading, isError, refetch} = useQuery({
        queryKey: ["genre", genreId],
        queryFn: () => genreFetch(genreId),
        enabled: true,
    });

    if(!data){
       return(<Text>Loading...</Text>) 
    }
    return(
        <View style={styles.view}>
            <RenderList data={data}/>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: "#8856a7"
    },
})