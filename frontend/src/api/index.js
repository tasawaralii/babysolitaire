import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const getDailyChallenge = async () => {
  try {
    const response = await api.get('/daily-challenge');
    return response.data;
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    throw error;
  }
}

export { getDailyChallenge };
export default api;