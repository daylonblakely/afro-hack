import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NativeBaseProvider, Center, Spinner, useColorMode } from 'native-base';

import { RootStackParamList } from '../types/root-stack-param-list';
import { theme } from './theme';
import server from '../api/server';

import SigninScreen from '../screens/SigninScreen';
import HomeScreen from '../screens/HomeScreen';
import {
  SignupScreen1,
  SignupScreen2,
  SignupScreen3,
} from '../screens/SignupScreen';

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
  //   iosClientId: '<replace with your iOS client ID>',
});

const Stack = createStackNavigator<RootStackParamList>();

const RootComponent = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [hasProfile, setHasProfile] = useState(false); // Track if the user has completed the sign-up process
  const { colorMode } = useColorMode();
  const bgColor = theme.backgroundColor[colorMode || 'dark'];

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    setUser(user);

    if (user) {
      const response = await server.get('/auth/currentUser');
      setHasProfile(!!response.data);
    }

    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return (
      <Center flex={1} bg={bgColor}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: bgColor },
        }}
      >
        {!user ? (
          // If no user is signed in, show the SignIn screen
          <Stack.Screen name="SignIn" component={SigninScreen} />
        ) : !hasProfile ? (
          // If the user is signed in but hasn't completed the sign-up flow, show the Signup screens
          <>
            <Stack.Screen name="Signup1" component={SignupScreen1} />
            <Stack.Screen name="Signup2" component={SignupScreen2} />
            <Stack.Screen name="Signup3" component={SignupScreen3} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        ) : (
          // If the user is signed in and has completed their profile, show the Home screen
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <NativeBaseProvider theme={theme}>
      <RootComponent />
    </NativeBaseProvider>
  );
};
export default App;
