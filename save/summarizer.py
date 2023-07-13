import requests
import openai
from bs4 import BeautifulSoup

def CustomChatGPT(userInput):
  messages.append({"role": "user", "content": userInput})
  response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
  reply = response["choices"][0]["message"]["content"]
  messages.append({"role": "system", "content": reply})
  return reply

URL = "https://realpython.github.io/fake-jobs/"
page = requests.get(URL)
#print(page.text)

soup = BeautifulSoup(page.text, "html.parser")
allCards = soup.find_all("div", {"class":"card-content"})

#print(allCards[0])

jobs = []

for card in allCards:
    title = card.find("h2", {"class": "title is-5"})
    jobs.append(title.text)
    
openai.api_key = "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"

messages = [{"role": "system", "content": "Here is a list of jobs: " + str(jobs) + "Please only use this list to answer the following questions."}]

#print(jobs)

userInput = input("")
while userInput.lower() != "q":
    reply = CustomChatGPT(userInput)
    print(reply)
    userInput = input("")