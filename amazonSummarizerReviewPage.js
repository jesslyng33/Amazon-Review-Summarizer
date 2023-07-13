const axios = require('axios');
const { get } = require('cheerio');
const { JSDOM } = require('jsdom');
const { Configuration, OpenAIApi } = require('openai');

async function getReviews() {
    let allReviews = [];
    let pageNumber = 1;

    for (let i = 0; i < 3; i++) {
        const URL = `https://www.amazon.com/Holy-Stone-Foldable-Quadcopter-Brushless/product-reviews/B07V3CLLCV/ref=cm_cr_arp_d_paging_btm_next_${pageNumber}?ie=UTF8&reviewerType=all_reviews&pageNumber=${pageNumber}`;
        const response = await axios.get('http://localhost:8050/render.html', {
          params: {
            url: URL,
            wait: 2
          }
        });
    
        const dom = new JSDOM(response.data);
        const document = dom.window.document;
        const reviewCards = document.querySelectorAll("div.a-section.review.aok-relative");

        reviewCards.forEach((card) => {
            const review = card.querySelector("span.a-size-base.review-text.review-text-content span");
            if (review) {
                allReviews.push(review.textContent);
            }
        });
    
        pageNumber++;
      }

    return allReviews;
}

async function getReviewSummary() {
  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);
  
  const allReviews = await getReviews();

  const prompt = `Here is a list of reviews for a product: ${JSON.stringify(allReviews)}. Please give a summary of the reviews of this product. Please make it around 150 words.`;

  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-16k-0613',
    messages: [
      { role: 'user', content: prompt }
    ],
  });

  const reply = response.data.choices[0].message.content;
  console.log(reply);
}

getReviewSummary();