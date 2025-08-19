import { Tabs } from "expo-router";
import { ImageBackground, Image } from "react-native";
import "../globals.css";

export default function RootLayout() {

  return(
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: "Index",
          tabBarIcon: ({focused}) => (
            <>
                <ImageBackground>
                    <Image source={require("../../assets/images/home.png")} />
                </ImageBackground>
            </>
          )
        }}
      />
    </Tabs>
  );
}