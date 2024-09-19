import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NativeBaseProvider, Center, Spinner, useColorMode } from 'native-base';

import { RootStackParamList } from '../types/root-stack-param-list';
import { theme } from './theme';
import {
  Provider as UserProvider,
  useUserContext,
} from '../context/user-context';

import SigninScreen from '../screens/SigninScreen';
import SignupFlow from '../screens/SignupFlow';
import HomeScreen from '../screens/HomeScreen';

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
  //   iosClientId: '<replace with your iOS client ID>',
});

const Stack = createStackNavigator<RootStackParamList>();

const RootComponent = () => {
  const { state: user } = useUserContext();
  const [initializing, setInitializing] = useState(true);
  const [firebaseUser, setFirebaseUser] =
    useState<FirebaseAuthTypes.User | null>(null);
  const { colorMode } = useColorMode();
  const bgColor = theme.backgroundColor[colorMode || 'dark'];

  console.log('user: ', user);

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    setFirebaseUser(user);

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
        {!firebaseUser ? (
          // If no user is signed in, show the SignIn screen
          <Stack.Screen name="SignIn" component={SigninScreen} />
        ) : !user ? (
          // If the user is signed in but hasn't completed the sign-up flow, show the Signup screens
          <Stack.Screen name="Signup" component={SignupFlow} />
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
      <UserProvider>
        <RootComponent />
      </UserProvider>
    </NativeBaseProvider>
  );
};
export default App;
