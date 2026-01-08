const API_URL = import.meta.env.VITE_API_URL;

axios.get(`${API_URL}/player`);
axios.get(`${API_URL}/record`);
