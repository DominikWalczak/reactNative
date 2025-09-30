import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import Constants from 'expo-constants';
import RenderList from "./RenderList";
import { Movie } from "./RenderList";

export default function Genre(){
    const { genreId } = useLocalSearchParams<{genreId: string}>();
    const API_KEY = Constants.expoConfig?.extra?.API_KEY ?? "";
      const HTTPS_DIRECTION = Constants.expoConfig?.extra?.HTTPS_DIRECTION ?? "";

    async function genreFetch({pageParam = 1, queryKey}: any) {
        try{
            const [_key, id] = queryKey;
            if (!id) return { results: [], page: 1, total_pages: 1 };
            const response = await fetch(`${HTTPS_DIRECTION}discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${pageParam}`);
            if(!response.ok) return [];
            return response.json() || [];
        }
        catch(error){
            console.error(`genreFetch Error: ${error}`);
            return [];
        }
    }

    const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch} = useInfiniteQuery({
        queryKey: ["genre", genreId],
        queryFn: genreFetch,
        initialPageParam: 1,
        enabled: true,
        getNextPageParam: (lastPage: any) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    });
    const movies: Movie[] = data
        ? data.pages.flatMap((page: any) => page.results)
        : [];
    
    if(!data){
       return(<Text>Loading...</Text>) 
    }
    return(
        <View style={styles.view}>
            <RenderList data={movies} loadMore={() => {if (hasNextPage) fetchNextPage();}}/>
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: "#8856a7"
    },
})