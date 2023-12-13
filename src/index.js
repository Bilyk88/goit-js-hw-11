import { Notify } from 'notiflix/build/notiflix-notify-aio';

const gallery = document.querySelector('.gallery');
const search = document.querySelector('.search-form');

search.addEventListener('submit', onSearch);

function onSearch(evt) {
    evt.preventDefault();
    const { searchQuery } = evt.currentTarget.elements;
    getImages(searchQuery.value).then(data => {
        console.log(data);
        if (!data.hits.length){
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        gallery.innerHTML = createMarkup(data.hits)
    }).catch(error => console.log(error));
    

}

function getImages(value) {
    const BASE_URL = 'https://pixabay.com/api/?';
    const API_KEY = '41243043-03fa0c09f0e0133208ded241a';

    return fetch(`${BASE_URL}key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true`)
        .then(resp => {
            if (!resp.ok) {
                throw new Error(resp.statusText);
            }
            return resp.json();
        })
    
    
}

function createMarkup(arr) {
    return arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`).join('');
    }