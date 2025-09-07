import { Stack, Slot } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import "./globals.css";

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  return(
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            title: "(tabs)",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#e0ecf4",
            },
          }}
        />
        <Stack.Screen
          name="opinion"
          options={{
            title: "",
            headerStyle: {
              backgroundColor: "#e0ecf4",
            },
          }}
        />
      </Stack>
    </QueryClientProvider>
  );

}