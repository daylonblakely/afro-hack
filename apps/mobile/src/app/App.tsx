import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { NativeBaseProvider, Center, Spinner, useColorMode } from 'native-base';

import { RootStackParamList } from '../types/root-stack-param-list';
import { theme } from './theme';

import SigninScreen from '../screens/SigninScreen';
import HomeScreen from '../screens/HomeScreen';
// import SignupScreen from '../screens/SignupScreen'; // Add this if you have the signup screen

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
  //   iosClientId: '<replace with your iOS client ID>',
});

const Stack = createStackNavigator<RootStackParamList>();

const RootComponent = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const { colorMode } = useColorMode();
  const bgColor = theme.backgroundColor[colorMode || 'dark'];

  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

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
          <Stack.Screen name="SignIn" component={SigninScreen} />
        ) : (
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
        {/* Add the SignUp screen */}
        {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
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
