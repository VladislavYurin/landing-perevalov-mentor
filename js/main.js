document.addEventListener('DOMContentLoaded', async () => {
  const api = new API();
  let reviews;

  const storedReviews = sessionStorage.getItem('reviews');

  if (storedReviews) {
    reviews = JSON.parse(storedReviews);
  } else {
    // const { reviews: fetchedReviews } = await api.getReviews();
    const response = await fetch('./src/reviews.json');
    const localReviews = await response.json();
    reviews = localReviews;
    sessionStorage.setItem('reviews', JSON.stringify(reviews));
  }

  api.displayReviews(reviews);
});

document.addEventListener('DOMContentLoaded', function () {
  const animateElements = document.querySelectorAll('.animate-element');

  window.addEventListener('scroll', checkScroll);
  checkScroll();

  function checkScroll() {
    animateElements.forEach(function (element) {
      const rect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      if (rect.top + rect.height <= viewportHeight) {
        element.classList.add('show');
      }
    });

    if (Array.from(animateElements).every(el => el.classList.contains('show'))) {
      window.removeEventListener('scroll', checkScroll);
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.getElementById('carousel');
  const lastSlide = document.querySelector('.last-slide');
  const quotesImage = document.querySelector('.quotes');

  carousel.addEventListener('slid.bs.carousel', function () {
    const activeSlides = carousel.querySelectorAll('.carousel-item.active');

    if (activeSlides.length > 0 && activeSlides[activeSlides.length - 1] === lastSlide.parentNode) {
      quotesImage.style.opacity = '0';
    } else {
      quotesImage.style.opacity = '0.2';
    }
  });

  const initialActiveSlides = carousel.querySelectorAll('.carousel-item.active');
  if (initialActiveSlides.length > 0 && initialActiveSlides[initialActiveSlides.length - 1] === lastSlide.parentNode) {
    quotesImage.style.opacity = '0';
  } else {
    quotesImage.style.opacity = '0.2';
  }
});