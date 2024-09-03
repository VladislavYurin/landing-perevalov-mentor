class API {
    constructor() {
        //https://cors-anywhere.herokuapp.com/
        this.url = "https://reviews.it-mentors.ru";
        this.id = '388052505';
        this.initMethod = "/reviews-json";
    }

    async getReviews() {
        let reviews = [];
        let nextUrl = `${this.url}/${this.initMethod}?id=${this.id}`;

        while (nextUrl) {
            const data = await this.getReview(nextUrl);
            reviews.push(...data.reviews);

            if (data.next) {
                nextUrl = this.url + data.next;
            } else {
                break;
            }
        }

        return { reviews };
    }

    async getReview(url) {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Credentials": "true"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка при загрузке отзывов:', error);
        }
    }

    parseReview(reviewString) {
        const lines = reviewString.split('\n').slice(1);
        lines.pop();
        const authorLine = lines[lines.length - 1];
        const author = authorLine.replace("Автор: ", "");
        lines.splice(-2);
        const text = lines.join('\n').trim();

        return { author, text };
    }

    createReviewElement(review, id) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'review';
        reviewDiv.id = id;

        const authorA = document.createElement('a');
        authorA.className = 'author';
        authorA.textContent = review.author;
        authorA.href = "https://t.me/" + review.author.slice(1);

        const textDiv = document.createElement('div');
        textDiv.className = 'review-text';
        textDiv.innerHTML = review.text;

        reviewDiv.appendChild(authorA);
        reviewDiv.appendChild(textDiv);

        return reviewDiv;
    }

    displayReviews(reviews) {
        const reviewsContainer = document.querySelector('.reviews-container');
        reviews.forEach((review, id) => {
            const reviewElement = this.createReviewElement(this.parseReview(review), id);
            reviewsContainer.appendChild(reviewElement);
        });

        this.initCarousel();
    }

    initCarousel() {
        let reviews = document.querySelectorAll('.review');
        let currentIndex = 0;
        reviews[currentIndex].classList.add("active");
        const prevButton = document.querySelector('.carousel-prev');
        const nextButton = document.querySelector('.carousel-next');

        prevButton.addEventListener('click', () => this.showPrevReview.call(this));
        nextButton.addEventListener('click', () => this.showNextReview.call(this));

        setInterval(() => this.showNextReview.call(this), 30000);
    }

    showPrevReview() {
        let reviews = document.querySelectorAll('.review');
        let currentIndex = Array.from(reviews).findIndex(review => review.classList.contains('active'));
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = reviews.length - 1;
        }
        this.updateActiveReview(currentIndex, reviews);
    }

    showNextReview() {
        let reviews = document.querySelectorAll('.review');
        let currentIndex = Array.from(reviews).findIndex(review => review.classList.contains('active'));
        currentIndex++;
        if (currentIndex >= reviews.length) {
            currentIndex = 0;
        }
        this.updateActiveReview(currentIndex, reviews);
    }

    updateActiveReview(currentIndex, reviews) {
        reviews.forEach(review => review.classList.remove('active'));
        reviews[currentIndex].classList.add('active');
    }
}