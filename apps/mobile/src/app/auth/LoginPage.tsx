import React, { useState, useEffect } from 'react';
import { Button, View, Text } from 'react-native';
import { authorize, AuthorizeResult } from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { googleConfig, facebookConfig } from './auth-config';
import sever from '../api/sever';

const LoginPage = () => {
  const [authState, setAuthState] = useState<AuthorizeResult | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('jwtToken');
      if (token) {
        setJwtToken(token);
      }
    };
    loadToken();
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const result = await authorize(googleConfig);
      setAuthState(result);

      const response = await sever.post('/auth/google', {
        token: result.idToken,
      });

      const token = response.data.token;
      await AsyncStorage.setItem('jwtToken', token);
      setJwtToken(token);
    } catch (error) {
      console.error('Google login error', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const result = await authorize(facebookConfig);
      setAuthState(result);

      const response = await sever.post('/auth/facebook', {
        token: result.accessToken,
      });

      const token = response.data.token;
      await AsyncStorage.setItem('jwtToken', token);
      setJwtToken(token);
    } catch (error) {
      console.error('Facebook login error', error);
    }
  };

  const fetchProtectedData = async () => {
    if (!jwtToken) return;

    try {
      const response = await sever.get('/protected', {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      console.log('Protected data:', response.data);
    } catch (error) {
      console.error('Error fetching protected data', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {authState ? (
        <>
          <Text>Welcome, {authState.accessToken}</Text>
          <Button title="Fetch Protected Data" onPress={fetchProtectedData} />
        </>
      ) : (
        <>
          <Button title="Login with Google" onPress={handleGoogleLogin} />
          <Button title="Login with Facebook" onPress={handleFacebookLogin} />
        </>
      )}
    </View>
  );
};

export default LoginPage;
