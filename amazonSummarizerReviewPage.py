import requests
import openai
from bs4 import BeautifulSoup

allReviews = []

pageNumber = 1

for i in range(3):
    URL = "https://www.amazon.com/Holy-Stone-Foldable-Quadcopter-Brushless/product-reviews/B07V3CLLCV/ref=cm_cr_arp_d_paging_btm_next_" + str(pageNumber) + "?ie=UTF8&reviewerType=all_reviews&pageNumber=" + str(pageNumber)
    page = requests.get("http://localhost:8050/render.html", params = {"url": URL, "wait": 2})
    
    soup = BeautifulSoup(page.text, "html.parser")
    allReviewCards = soup.find_all("div", {"class": "a-section review aok-relative"})

    for card in allReviewCards:
        review = card.find("span", {"class": "a-size-base review-text review-text-content"})
        review = review.find("span")
        allReviews.append(review.text)
        
    pageNumber = pageNumber+1

openai.api_key = "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"

messages = [{"role": "user", "content": "Here is a list of reviews for a product: " + str(allReviews) + "Please give a summary of the reviews of this product. Please make it around 150 words."}]

response = openai.ChatCompletion.create(model="gpt-3.5-turbo-16k-0613", messages=messages)
reply = response["choices"][0]["message"]["content"]
print(reply)