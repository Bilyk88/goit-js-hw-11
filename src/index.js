import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector('.gallery');
const search = document.querySelector('.search-form');
const target = document.querySelector('.js-guard');

const photoGallery = new SimpleLightbox('.gallery a');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '41243043-03fa0c09f0e0133208ded241a';
let searchQuery;
let currentPage = 1;

let options = {
  root: null,
  rootMargin: "500px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  photoGallery.refresh();
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      
      currentPage += 1;
      getImages(searchQuery, currentPage).then(data => {

        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
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
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  
  getImages(searchQuery, currentPage).then(data => {
        // console.log(data);
    if (!data.hits.length) {
          gallery.innerHTML = "";
          Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        else {
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
          gallery.innerHTML = createMarkup(data.hits);
          photoGallery.refresh();
          observer.observe(target);
          
      }

    }).catch(error => console.log(error));
}

async function getImages(value, page = 1) {

  //   const resp = await fetch(`${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
  // if (!resp.ok) {
  //   throw new Error(resp.statusText);
  // }
  // return await resp.json();

   const resp = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`);
   return await resp.data;

}

function createMarkup(arr) {
  return arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `<div class="photo-card">
    <div><a class="gallery-photo" href="${largeImageURL}"><img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" /></a></div>
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
  
