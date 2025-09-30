import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import RenderList from "./RenderList";
import Constants from 'expo-constants';
import { useInfiniteQuery } from "@tanstack/react-query";
import { Movie } from "./RenderList";

export default function Credits(){

    const {creditId} = useLocalSearchParams<{creditId: string}>()
    const API_KEY = Constants.expoConfig?.extra?.API_KEY ?? "";
    const HTTPS_DIRECTION = Constants.expoConfig?.extra?.HTTPS_DIRECTION ?? "";

    async function creditFetch({pageParam = 1, queryKey}: any) {
        try{
            const [_key, id] = queryKey;
            if (!id) return { results: [], page: 1, total_pages: 1 };
            const response = await fetch(`${HTTPS_DIRECTION}discover/movie?api_key=${API_KEY}&with_cast=${id}&page=${pageParam}`);
            if(!response.ok) return [];
            return response.json() || [];
        }
        catch(error){
            console.error(`Fetching error: ${error}`);
            return [];
        }

    }
    const { data, isLoading, isError, fetchNextPage, hasNextPage, refetch} = useInfiniteQuery({
        queryKey: ["credit", creditId],
        queryFn: creditFetch,
        initialPageParam: 1,
        enabled: true,
        getNextPageParam: (lastPage: any) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    });

    const movies: Movie[] = data
        ? data.pages.flatMap((page: any) => page.results)
        : [];
    
    return(
    <View style={styles.view}>
        <RenderList data={movies} loadMore={() => {if (hasNextPage) fetchNextPage();}}/>
    </View>
    )
}
const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: "#8856a7",
    },
});
