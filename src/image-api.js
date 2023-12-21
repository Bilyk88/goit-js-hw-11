import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '41243043-03fa0c09f0e0133208ded241a';

export async function getImages(value, page = 1) {
try {
    const resp = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);

    return resp.data;
    
} catch (error) {
    console.log(error)
    }
};
