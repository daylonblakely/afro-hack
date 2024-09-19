import { View } from 'react-native';
import React from 'react';
import server from '../api/server';
import { useColorMode, Button } from 'native-base';
import { useUserContext } from '../context/user-context';

const HomeScreen = () => {
  const { toggleColorMode } = useColorMode();
  const { signOut } = useUserContext();

  return (
    <View>
      <Button
        marginTop={4}
        onPress={() => {
          server
            .get('/auth/currentUser')
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              console.error('Error fetching data:', error);
            });
        }}
      >
        protected
      </Button>
      <Button marginTop={4} onPress={signOut}>
        Sign out
      </Button>
      <Button marginTop={4} onPress={toggleColorMode}>
        Toggle Dark/Light Mode
      </Button>
    </View>
  );
};

export default HomeScreen;
