import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import {getImages} from './image-api.js';

const gallery = document.querySelector('.gallery');
const search = document.querySelector('.search-form');
const target = document.querySelector('.js-guard');

const photoGallery = new SimpleLightbox('.gallery a');

let searchQuery;
let currentPage = 1;

let options = {
  root: null,
  rootMargin: "500px",
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

async function onLoad(entries, observer) {

  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      
      currentPage += 1;
      const data = await getImages(searchQuery, currentPage);

        gallery.insertAdjacentHTML('beforeend', createMarkup(data.hits));
        photoGallery.refresh();
        if (currentPage > data.totalHits / 40) {
          Notify.failure("We're sorry, but you've reached the end of search results.");       
          observer.unobserve(target);
      };      
    };
  });
}

search.addEventListener('submit', onSearch);

async function onSearch(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value;
  currentPage = 1;
  const data = await getImages(searchQuery, currentPage);
  
    if (!data.hits.length) {
          gallery.innerHTML = "";
          Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        }
        else {
          Notify.success(`Hooray! We found ${data.totalHits} images.`);
          gallery.innerHTML = createMarkup(data.hits);
          photoGallery.refresh();
          observer.observe(target);   
  };
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
  
