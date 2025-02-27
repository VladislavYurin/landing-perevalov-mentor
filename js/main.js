document.addEventListener('DOMContentLoaded', async () => {
    const api = new API();

    const response = await api.getReviews();
    // const response = await fetch('./src/reviews.json');
    // reviews = await fetchedReviews.json();
    api.displayReviews(response.reviews);
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

    carousel.addEventListener('slid.bs.carousel', function () {
        const activeSlide = carousel.querySelector('.carousel-item.active');
        const lastSlide = document.querySelector('.last-slide');
        const quotesImage = document.querySelector('.quotes');
        if (activeSlide === lastSlide.parentNode) {
            quotesImage.style.opacity = '0';
        } else {
            quotesImage.style.opacity = '0.2';
        }
    });
});