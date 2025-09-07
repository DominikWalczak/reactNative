import { StyleSheet, FlatList, Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";

interface Movie {
  id: number;
  title: string;
  release_date?: string; 
  poster_path: string | null;
}
interface ListProps {
  data: Movie[];
}


export default function RenderList({ data }: ListProps){ 
  // komponent generujący listy na podstawie podanych danych który posiada możliwości przekierowania do details

    function handleRedirect(id: string){
    router.push({
        pathname: "/details",
        params: { imdbID: id},
    })
    }
    return(
    <FlatList 
        contentContainerStyle={styles.movie}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <Pressable style={styles.movieItem} onPress={() => handleRedirect(item.id.toString())}>
            <Image style={styles.movieItemImage} source={{uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`}} alt="No image"/>
            <View style={styles.movieItemView}>
                <Text style={styles.movieItemViewTitle}>Title: {item.title}</Text>
                <Text style={styles.movieItemViewYear}>Year: {item.release_date}</Text>
                <Text style={styles.movieItemViewYear}>imdbID: {item.id}</Text>
            </View>
            </Pressable>
        )}
    />
    )
}

const styles = StyleSheet.create({
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
});