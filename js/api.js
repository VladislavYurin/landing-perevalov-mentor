class API {
    constructor() {
        this.url = "https://reviews.it-mentors.ru";
        this.id = '388052505';
        this.initMethod = "reviews-json";
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
                    "Access-Control-Allow-Credentials": "true",
                    "Origin": "*"
                }
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }

    parseReview(reviewString) {
        const lines = reviewString.split('\n');

        // Находим последнюю строку с автором, начиная с конца
        let authorIndex = -1;
        for (let i = lines.length - 1; i >= 0; i--) {
            if (/Автор:/.test(lines[i])) {
                authorIndex = i;
                break;
            }
        }

        if (authorIndex === -1) {
            return { author: null, text: lines.slice(2).join('<br>') };
        }

        // Извлекаем автора
        const authorLine = lines[authorIndex];
        const author = this.parseUsername(authorLine);

        // Собираем текст до автора
        const textLines = lines.slice(2, authorIndex);
        const text = textLines.join('<br>');

        return { author, text };
    }

    parseUsername(authorLine) {
        const match = authorLine.match(/Автор: (.+)$/m);
        return match && match[1] || null;
    }

    createReviewElement(review, id) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'carousel-item';
        if (id == 0) {
            reviewDiv.classList.add("active");
            reviewDiv.setAttribute("data-bs-interval", "1000000");
        } else {
            reviewDiv.setAttribute("data-bs-interval", "1000000");
        }

        const authorA = document.createElement('a');
        authorA.className = 'author';
        authorA.textContent = "Автор: " + review.author;
        authorA.href = "https://t.me/" + review.author.slice(1);

        const telegramLogo = document.createElement("i");
        telegramLogo.className = "fa-brands fa-telegram";
        authorA.appendChild(telegramLogo);

        const textDiv = document.createElement('div');
        textDiv.className = 'review-text';
        textDiv.innerHTML = review.text;

        reviewDiv.appendChild(textDiv);
        reviewDiv.appendChild(authorA);

        return reviewDiv;
    }

    // createIndicatorElement(id) {
    //     const indicatorButton = document.createElement('button');
    //     indicatorButton.setAttribute("type", "button");
    //     indicatorButton.setAttribute("data-bs-target", "#carousel");
    //     indicatorButton.setAttribute("data-bs-slide-to", id);
    //     indicatorButton.setAttribute("aria-label", "Slide " + (id + 1));
    //     if (id == 0) {
    //         indicatorButton.className = "active";
    //         indicatorButton.setAttribute("aria-current", "true");
    //     }
    //     return indicatorButton;
    // }

    createLastSlideElement() {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'carousel-item';
        reviewDiv.setAttribute("data-bs-interval", "1000000");

        const link = document.createElement('a');
        link.className = 'author last-slide';
        link.innerHTML = `Ознакомиться со всеми отзывами <br> по #smash_buster`;
        link.href = "https://t.me/it_mentors";

        const telegramLogo = document.createElement("i");
        telegramLogo.className = "fa-brands fa-telegram";
        link.appendChild(telegramLogo);

        reviewDiv.appendChild(link);

        return reviewDiv;
    }

    displayReviews(reviews) {
        const reviewsContainer = document.querySelector('.carousel-inner');
        // const indicatorsContainer = document.querySelector('.carousel-indicators')
        reviews.forEach((review, id) => {
            const reviewElement = this.createReviewElement(this.parseReview(review), id);
            // const indicatorButton = this.createIndicatorElement(id);
            reviewsContainer.appendChild(reviewElement);
            // indicatorsContainer.appendChild(indicatorButton);
        });
        const lastSlide = this.createLastSlideElement();
        reviewsContainer.appendChild(lastSlide);
    }
}