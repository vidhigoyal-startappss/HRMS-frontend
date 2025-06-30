import axios from 'axios';

export const fetchFestivals = async () => {
  const res = await axios.get('http://localhost:3000/calendar/festivals');
  return res.data;
};
