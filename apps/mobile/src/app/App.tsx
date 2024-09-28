import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NativeBaseProvider } from 'native-base';

import { RootStackParamList } from '../types/root-stack-param-list';
import { theme } from './theme';
import {
  Provider as UserProvider,
  useUserContext,
} from '../context/user-context';
import {
  Provider as LoadingProvider,
  useLoadingContext,
} from '../context/loading-context';
import { Provider as ConfigProvider } from '../context/signup-config';
import { Provider as FlashCardProvider } from '../context/flash-card-context';
import { getUser } from './async-storage'; // getUser to retrieve stored token
import Background from '../components/Background';

import SigninScreen from '../screens/SigninScreen';
import SignupFlow from '../screens/SignupFlow';
import SignupSplash from '../screens/SignupSplash';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen'; // New splash screen
import LoadingOverlay from '../components/LoadingOverlay';

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
});

const Stack = createStackNavigator<RootStackParamList>();

const AppComponent = () => {
  const {
    state: appUser,
    actions: { fetchUser },
  } = useUserContext();
  const {
    state: { isLoading, message },
  } = useLoadingContext();
  const [initializing, setInitializing] = useState(true);
  const [showSplash, setShowSplash] = useState(true); // New state for splash screen

  // Listener to handle user authentication state
  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    // Firebase authentication state listener
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const credentials = await getUser();
        if (credentials) {
          const googleCredential =
            auth.GoogleAuthProvider.credential(credentials);
          await auth().signInWithCredential(googleCredential);
          await fetchUser(); // Fetch the user after successful sign-in
        }
      } catch (error) {
        console.log('Error fetching user:', error);
      }
    };

    checkLoginStatus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if (showSplash) {
  //   return <SplashScreen onFinish={() => setShowSplash(false)} />;
  // }

  return (
    <>
      {isLoading || initializing ? <LoadingOverlay message={message} /> : null}
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: 'transparent',
          },
        }}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          {!appUser ? (
            <>
              {/* If no user is signed in, show the SignIn screen */}
              <Stack.Screen name="SignIn" component={SigninScreen} />
              {/* If the user is signed in but hasn't completed the sign-up flow, show the Signup screens */}
              <Stack.Screen name="SignupSplash" component={SignupSplash} />
              <Stack.Screen name="Signup" component={SignupFlow} />
            </>
          ) : (
            // If the user is signed in and has completed their profile, show the Home screen
            <Stack.Screen name="Home" component={HomeScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

const App = () => {
  return (
    <NativeBaseProvider theme={theme}>
      <LoadingProvider>
        <ConfigProvider>
          <UserProvider>
            <FlashCardProvider>
              <StatusBar
                translucent
                backgroundColor="#17171780" // muted.900
                barStyle="light-content"
              />
              <Background />
              <AppComponent />
            </FlashCardProvider>
          </UserProvider>
        </ConfigProvider>
      </LoadingProvider>
    </NativeBaseProvider>
  );
};

export default App;
