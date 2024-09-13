import axios from 'axios';
import auth from '@react-native-firebase/auth';

async function getIdToken() {
  const currentUser = auth().currentUser;
  if (currentUser) {
    const idToken = await currentUser.getIdToken();
    return idToken;
  }
  return null;
}

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:5000',
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getIdToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
