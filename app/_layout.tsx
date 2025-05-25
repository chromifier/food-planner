import { Stack } from "expo-router";
import { IngredientsProvider } from "../context/ingredientsProvider";
import { RecipesProvider } from "@/context/recipesProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const CombinedProviders = ({ children }: { children: React.ReactNode; }) => (
  <IngredientsProvider>
    <RecipesProvider>
      {children}
    </RecipesProvider>
  </IngredientsProvider>
);

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CombinedProviders>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </CombinedProviders>
    </GestureHandlerRootView>
  );
}
