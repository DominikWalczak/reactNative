import { StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import RenderList from "./RenderList";
import Constants from 'expo-constants';
import { useQuery } from "@tanstack/react-query";

export default function Credits(){

    const {creditId} = useLocalSearchParams<{creditId: string}>()
    const { API_KEY } = Constants.expoConfig.extra as { API_KEY: string };

    async function creditFetch(id: string) {
        if (!id) return;
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_cast=${id}`);
        const json = await response.json();
        return json.results || [];
    }
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["credit", creditId],
        queryFn: () => creditFetch(creditId),
        enabled: true,
    });
    return(
    <View style={styles.view}>
        <RenderList data={data}/>
    </View>
    )
}
const styles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: "#8856a7",
    },
});
