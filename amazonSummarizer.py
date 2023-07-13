import requests
import openai
from bs4 import BeautifulSoup

URL = "https://www.amazon.com/VanFn-Foldable-Lightweight-Backpack-Shoulder/dp/B08TLRVJ3P/ref=sr_1_18_sspa?crid=2QWFOZJWKY70K&keywords=travel+luggage+bag+compact+size&qid=1687916189&sprefix=travel+luggage+bag+compact+siz%2Caps%2C99&sr=8-18-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9tdGY&psc=1"
page = requests.get("http://localhost:8050/render.html", params = {"url": URL, "wait": 2})

soup = BeautifulSoup(page.text, "html.parser")
allReviewCards = soup.find_all("div", {"class": "a-section review aok-relative"})

allReviews = []

for card in allReviewCards:
    review = card.find("div", {"class": "a-expander-content reviewText review-text-content a-expander-partial-collapse-content"})
    review = review.find("span")
    allReviews.append(review.text)

openai.api_key = "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"

messages = [{"role": "user", "content": "Here is a list of reviews for a product: " + str(allReviews) + "Please give a summary of the reviews of this product."}]

response = openai.ChatCompletion.create(model="gpt-3.5-turbo-16k-0613", messages=messages)
reply = response["choices"][0]["message"]["content"]
print(reply)