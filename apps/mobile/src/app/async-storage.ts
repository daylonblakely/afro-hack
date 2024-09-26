import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUser = async (value: string) => {
  try {
    await AsyncStorage.setItem('@user_credentials', value);
  } catch (e) {
    console.log(e);
  }
};

export const getUser = async () => {
  try {
    const value = await AsyncStorage.getItem('@user_credentials');

    return value;
  } catch (e) {
    console.log(e);
  }
};

export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem('@user_credentials');
  } catch (e) {
    console.log(e);
  }
};
