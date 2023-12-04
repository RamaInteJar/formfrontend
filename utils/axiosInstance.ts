import { baseUrl } from '@/config/apiConfig';
import axios from 'axios';

export const axisoInstance = axios.create({
  baseURL: baseUrl,
});
