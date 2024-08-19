import React from "react";
import { Stack } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="Home"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
    </Stack>
  );
}
