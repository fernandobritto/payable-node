import axios from 'axios';

const api = axios.create({
 baseURL: 'http://localhost:0000'
});

export default api;
