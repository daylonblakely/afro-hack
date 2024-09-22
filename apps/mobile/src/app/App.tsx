import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
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
import {
  Provider as LoadingProvider,
  useLoadingContext,
} from '../context/loading-context';
import { Provider as ConfigProvider } from '../context/signup-config';

import SigninScreen from '../screens/SigninScreen';
import SignupFlow from '../screens/SignupFlow';
import SignupSplash from '../screens/SignupSplash';
import HomeScreen from '../screens/HomeScreen';
import LoadingOverlay from '../components/LoadingOverlay';

GoogleSignin.configure({
  offlineAccess: true,
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_SIGN_IN_WEB_CLIENT_ID,
  //   iosClientId: '<replace with your iOS client ID>',
});

const Stack = createStackNavigator<RootStackParamList>();

const RootComponent = () => {
  const { state: appUser, fetchUser, signOut } = useUserContext();
  const { state: isLoading } = useLoadingContext();
  const [initializing, setInitializing] = useState(true);
  const [fireBaseUser, setFireBaseUser] =
    useState<FirebaseAuthTypes.User | null>(null);
  const { colorMode } = useColorMode();
  const bgColor = theme.backgroundColor[colorMode || 'dark'];

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    setFireBaseUser(user);

    if (initializing) setInitializing(false);
  };

  useEffect(() => {
    if (fireBaseUser && !appUser) {
      fetchUser().catch(() => {
        console.log('error fetching user');
      });
    }
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (initializing) {
    return (
      <Center flex={1} bg={bgColor}>
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <>
      {isLoading ? <LoadingOverlay /> : null}
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: bgColor },
          }}
        >
          {!appUser ? (
            <>
              {/* // If no user is signed in, show the SignIn screen */}
              <Stack.Screen name="SignIn" component={SigninScreen} />
              {/* // If the user is signed in but hasn't completed the sign-up flow,
            show the Signup screens */}
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
            <StatusBar
              translucent
              backgroundColor="#17171780" // muted.900
              barStyle="light-content"
            />
            <RootComponent />
          </UserProvider>
        </ConfigProvider>
      </LoadingProvider>
    </NativeBaseProvider>
  );
};
export default App;
