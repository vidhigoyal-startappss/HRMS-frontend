import axios from 'axios';
import API from '../auth';

export const fetchFestivals = async () => {
  const res = await API.get('/calendar/festivals');
  return res.data;
};
