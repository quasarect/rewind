import os
import openai
import requests    
from dotenv import load_dotenv

#load the .env file
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


#take audio file and transcribe into text format. To be edited further       
def take_prompt():
    prompt = "search for YugaKwon"
    return prompt


#check if the response is successful
def check_response(response):
    if response.status_code == 200:
        # the request was successful, print the response data
        print(response.json())
    else:
        # the request failed, print the error message
        print('Error:', response.text)       


#execute the command received from the prompt
def execute_command(prompt):
    
    #get the auth token and user id from idk where.
        #if have auth token, then use it to create userid or vice versa
        #auth_token and userid are hardcoded
    auth = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzliZmE1MTJiNzY3ODgyYWVlOGI5YiIsInVzZXJuYW1lIjoidXNlciIsIl92IjoiMS4wLjAiLCJpYXQiOjE2ODE2NzMwNDEsImV4cCI6MTY4MjI3Nzg0MX0.Ylu2myZVgDlSwFrsc3h3g2Is49wgeRl4DAYXYCYBL7I"
    #userid = "6439bfa512b767882aee8b9b"
    
    base = os.getenv("BASE_URL")
    
    #various prompts to be used
    create_post = f"the url for creating a post is {base}posts/create and the method is POST and payload consists of only text"
    search_user = f"the url for searching a user is {base}search/username?username=((name)) and the method is GET"
    search_song = f"the url for searching a song is {base}search/song?text=((song)) and the method is GET"
    response_format = '{"url"= "", "method" = " ", "payload" = {"text" = " "}}'
    
    #create the prompt for the openai api
    user_prompt = f'{prompt}. fit the given query only one of the following calls. {search_song}. {create_post}. {search_user}.give the url, method and payload required for making an api call stored. Give all this in a dictionary format.Respond strictly in given format {response_format}.'
    
    #provide the prompt to the openai api
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= [{"role": "system", "content": "hello world"},
        {"role": "user", "content": user_prompt}],
        # temperature=0,
        # max_tokens=100,
        # top_p=1,
        # frequency_penalty=0,
        # presence_penalty=0
    )

    #receive the response from the openai api and convert it to a dictionary
        #response will be in string format
    
    response = response['choices'][0]['message']['content']
    print(response)
    response = eval(response)
    print(response)

    #create the headers for the api call
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {auth}'
    }

    #get the url, method and payload from the response
    method = response.get("method")
    url = response.get("url")
    payload = response.get("payload")

    #make the api call
    response = requests.request(method, url, headers=headers, json=payload)

    #check if the response is successful
    check_response(response)
    
if __name__ == "__main__":
    prompt = take_prompt()
    execute_command(prompt)