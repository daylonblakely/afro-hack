import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import SigninScreen from '../screens/SigninScreen';
import HomeScreen from '../screens/HomeScreen';

export const App = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Handle user state changes
  function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return <SigninScreen />;
  }

  return <HomeScreen />;
};

export default App;
