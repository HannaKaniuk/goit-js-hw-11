import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '40538294-532b9d41dacfc837c400cb4b1';
const perPage = 40;
let page = 1;
let loading = false; 

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.getElementById('gallery'),
};

refs.searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  page = 1;
  refs.gallery.innerHTML = '';
  loadImages();
});


window.addEventListener('scroll', function () {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 100 && !loading) {
    page++;
    loadImages();
  }
});

let hasShownTotalHitsMessage = false;

async function loadImages() {
  const searchQuery = document.querySelector('input[name="searchQuery"]').value;

  try {
    loading = true;

    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: perPage,
        page: page,
      },
    });

    const images = response.data.hits;
    const totalHits = response.data.totalHits;

    if (images.length === 0) {
      alert('No images found for your search.');
    } else {
      displayImages(images);
      if (!hasShownTotalHitsMessage) {
        showTotalHitsMessage(totalHits);
        hasShownTotalHitsMessage = true;
      }
    }

    const lightbox = new SimpleLightbox('.photo-card a', {
      animationSpeed: 100,
    });
    lightbox.refresh();
  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
    loading = false;
  }
}

function showTotalHitsMessage(totalHits) {
  const messageContainer = document.createElement('div');
  messageContainer.textContent = `Hooray! We found ${totalHits} images.`;
  document.body.appendChild(messageContainer);

  
  setTimeout(() => {
    document.body.removeChild(messageContainer);
  }, 5000); 
}


function showTotalHitsMessage(totalHits) {
  alert(`Hooray! We found ${totalHits} images.`);
}

function displayImages(images) {
  let template = '';
  images.forEach(image => {
    template += `
      <div class="photo-card">
        <a href="${image.largeImageURL}" class="image-link" data-lightbox="photos">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${image.downloads}
          </p>
        </div>
      </div>
    `;
  });
  refs.gallery.innerHTML += template;
}


