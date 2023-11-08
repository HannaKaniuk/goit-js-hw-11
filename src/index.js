import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '40538294-532b9d41dacfc837c400cb4b1';
const perPage = 40;
let page = 1;

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.getElementById('gallery'),
  loadMoreButton: document.getElementById('load-more'),
};

refs.searchForm.addEventListener('submit', function (e) {
  e.preventDefault();
  page = 1;
  refs.gallery.innerHTML = ''; // Обновляем использование refs
  loadImages();
});

refs.loadMoreButton.addEventListener('click', function () {
  page++;
  loadImages();
});

async function loadImages() {
  const searchQuery = document.querySelector('input[name="searchQuery"]').value;

  try {
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

    if (images.length === 0) {
      alert('No images found for your search.');
    } else {
      displayImages(images);
    }

    if (images.length < perPage) {
      refs.loadMoreButton.style.display = 'none';
    }

    const lightbox = new SimpleLightbox('.photo-card a', {
      animationSpeed: 100,
    });
    lightbox.refresh();
  } catch (error) {
    console.error('Error fetching images:', error);
  }
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
            <b>Лайки</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Просмотры</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Комментарии</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Загрузки</b> ${image.downloads}
          </p>
        </div>
      </div>
    `;
  });
  refs.gallery.innerHTML += template;
}


const lightbox = new SimpleLightbox('.photo-card a', {
  animationSpeed: 100,
});
