import { Notify } from 'notiflix/build/notiflix-notify-aio';

const gallery = document.querySelector('.gallery');
const search = document.querySelector('.search-form');
const target = document.querySelector('.js-guard');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '41243043-03fa0c09f0e0133208ded241a';
let searchQuery;
let currentPage = 10;

let options = {
  root: null,
  rootMargin: "300px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
 
  entries.forEach((entry) => {
    console.log(entry);
    if (entry.isIntersecting) {
      currentPage += 1;
      getImages(searchQuery, currentPage).then(data => {
        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        console.log(data.totalHits / 40);
        console.log(currentPage);
        if (currentPage > data.totalHits / 40) {
          observer.unobserve(target);
        }
      }).catch(error => console.log(error));

    }
  });
}


search.addEventListener('submit', onSearch);

function onSearch(evt) {
  evt.preventDefault();
  console.log(evt.currentTarget.elements.searchQuery.value);
  searchQuery = evt.currentTarget.elements.searchQuery.value;

    // const { searchQuery } = evt.currentTarget.elements;
    getImages(searchQuery, currentPage).then(data => {
        console.log(data);
        if (!data.hits.length){
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      }
      gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
      observer.observe(target);
        // gallery.innerHTML = createMarkup(data.hits)
    }).catch(error => console.log(error));
    

}

function getImages(value, page = 1) {

    return fetch(`${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`)
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