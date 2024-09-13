import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Login from './Login';
import server from '../api/server';

export const App = () => {
  return (
    <View>
      <TouchableOpacity>
        <Text>hahahah</Text>
      </TouchableOpacity>
      <Login />
      <TouchableOpacity
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
        <Text>protected</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
