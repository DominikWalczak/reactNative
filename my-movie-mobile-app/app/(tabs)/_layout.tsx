import { Tabs } from "expo-router";
import { ImageBackground, Image } from "react-native";
import "../globals.css";
import { useEffect } from "react";
import { initDatabase } from "../db/datebase";

export default function RootLayout() {

  useEffect(() =>{
    initDatabase();
  }, [])
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
      <Tabs.Screen
        name="list"
        options={{
          title: "List",
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <>
              <ImageBackground>
                <Image source={require("../../assets/images/save.png")}/>
              </ImageBackground>
            </>
          )
        }}
      
      
      />
    </Tabs>
  );
}