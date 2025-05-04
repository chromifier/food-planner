import { Stack } from "expo-router";
import { IngredientsProvider } from "../context/ingredientsProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <IngredientsProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </IngredientsProvider>
    </GestureHandlerRootView>
  );
}
