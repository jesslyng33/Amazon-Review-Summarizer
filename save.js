/*
const axios = require('axios');
const { get } = require('cheerio');
const { JSDOM } = require('jsdom');
const { Configuration, OpenAIApi } = require('openai');
const express = require("express");
const app = express();
const port = 8383;

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.status(200).send('<h1>hi</h1>')
})

app.listen(port, () => console.log(`Server has started on port: ${port}`))
*/

// amazon summarizer

async function getReviews(URL) {
    const response = await axios.get("http://localhost:8050/render.html", {
        params: {
        url: URL,
        wait: 2,
        },
    });

    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    const reviewCards = document.querySelectorAll("div.a-section.review.aok-relative");

    const allReviews = [];
    reviewCards.forEach((card) => {
        const review = card.querySelector("div.a-expander-content.reviewText.review-text-content.a-expander-partial-collapse-content span");
        if (review) {
            allReviews.push(review.textContent);
        }
    });

    return allReviews;
}

async function getReviewSummary() {
  const configuration = new Configuration({
    apiKey: "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",
  });

  const openai = new OpenAIApi(configuration);
  
  const URL = "https://www.amazon.com/VanFn-Foldable-Lightweight-Backpack-Shoulder/dp/B08TLRVJ3P/ref=sr_1_18_sspa?crid=2QWFOZJWKY70K&keywords=travel+luggage+bag+compact+size&qid=1687916189&sprefix=travel+luggage+bag+compact+siz%2Caps%2C99&sr=8-18-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9tdGY&psc=1";
  const allReviews = await getReviews(URL);

  const prompt = `Here is a list of reviews for a product: ${JSON.stringify(allReviews)}. Please give a summary of the reviews of this product.`;

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