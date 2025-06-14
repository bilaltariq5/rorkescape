import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { useUserStore } from "@/store/user-store";
import { ThemeProvider } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "@/lib/trpc";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={new QueryClient()}>
          <trpc.Provider client={trpcClient} queryClient={new QueryClient()}>
            <RootLayoutNav />
          </trpc.Provider>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  const { isOnboarded } = useUserStore();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  
  useEffect(() => {
    // Check if the user has completed onboarding
    if (!isOnboarded && segments[0] !== 'onboarding') {
      router.replace('/onboarding');
    } else if (isOnboarded && segments[0] === 'onboarding') {
      router.replace('/');
    }
  }, [isOnboarded, segments]);
  
  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="education/[id]" options={{ headerShown: true }} />
        <Stack.Screen name="relapse" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}