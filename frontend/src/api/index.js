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

const submitChallengeScore = async (scoreData) => {
  try {
    const response = await api.post('/daily-challenge/score', scoreData);
    return response.data;
  } catch (error) {
    console.error('Error submitting challenge score:', error);
    throw error;
  }
}

const getLeaderboard = async () => {
  try {
    const response = await api.get('/daily-challenge/leaderboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

export { getDailyChallenge, submitChallengeScore, getLeaderboard };
export default api;