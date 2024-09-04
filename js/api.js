class API {
    constructor() {
        this.url = "https://proxy.cors.sh/" + "https://reviews.it-mentors.ru";
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
                    "Access-Control-Allow-Credentials": "true",
                    "Origin": "*"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    }

    parseReview(reviewString) {
        const lines = reviewString.split('\n').slice(1);
        lines.pop();
        const authorLine = lines[lines.length - 1];
        const author = authorLine.replace("Автор: ", "");
        lines.splice(-2);
        const text = lines.join('<br>').trim();

        return { author, text };
    }

    createReviewElement(review, id) {
        const reviewDiv = document.createElement('div');
        reviewDiv.className = 'carousel-item';
        if (id == 0) {
            reviewDiv.classList.add("active");
            reviewDiv.setAttribute("data-bs-interval", "1");
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

    createIndicatorElement(id) {
        const indicatorButton = document.createElement('button');
        indicatorButton.setAttribute("type", "button");
        indicatorButton.setAttribute("data-bs-target", "#carousel");
        indicatorButton.setAttribute("data-bs-slide-to", id);
        indicatorButton.setAttribute("aria-label", "Slide " + (id + 1));
        if (id == 0) {
            indicatorButton.className = "active";
            indicatorButton.setAttribute("aria-current", "true");
        }
        return indicatorButton
    }

    displayReviews(reviews) {
        const reviewsContainer = document.querySelector('.carousel-inner');
        const indicatorsContainer = document.querySelector('.carousel-indicators')
        reviews.forEach((review, id) => {
            const reviewElement = this.createReviewElement(this.parseReview(review), id);
            const indicatorButton = this.createIndicatorElement(id);
            reviewsContainer.appendChild(reviewElement);
            indicatorsContainer.appendChild(indicatorButton);
        });
    }
}