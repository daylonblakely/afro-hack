/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import server from './api/sever';

export const App = () => {
  return (
    <View>
      <TouchableOpacity
        onPress={async () => {
          const { data } = await server.get('/');
          console.log(data);
        }}
      >
        <Text>PRESS ME</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
