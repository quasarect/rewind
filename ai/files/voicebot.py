import requests
import pymongo
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
from io import BytesIO
import openai
from flask import request

#Load environment variables from .env file
load_dotenv() 

# voice bot functions
#take audio file and transcribe into text format. To be edited further
def take_prompt():

    try:
        audio_file = request.files['audio']

        print(audio_file.filename)

        audio_data = audio_file.read()
        audio_file_obj = BytesIO(audio_data)
        audio_file_obj.name = audio_file.filename

        transcript = openai.Audio.transcribe("whisper-1", audio_file_obj, response_format = "text") 
    except:
        pass

    return transcript


#check if the response is successful
def check_response(response):
    if response and response.status_code == 200:
        # the request was successful, return the response data
        return response.json()
    else:
        # the request failed, return the error message
        return {'error': response.text}    


#execute the command received from the prompt
def execute_command(prompt):

    print(prompt)
    
    #get the auth token and user id from idk where.
    #if have auth token, then use it to create userid or vice versa

    auth = request.headers.get('Authorization').split(' ')[1]
    
    base = os.getenv("BASE_URL")
    
    #various prompts to be used
    create_post = f"when query implies to create a post, use url /posts/create and the method is POST and payload consists of only text"
    search_user = f"when query implies to search for user, use url /search/username?username=((name)) and the method is GET"
    search_song = f"when query implies to search for song, use url /search/song?text=((song)) and the method is GET"
    response_format = '{"url"= "", "method" = " ", "payload" = {"text" = " "}}'
    
    #create the prompt for the openai api
    user_prompt = f'{prompt}. fit the given query appropriately in only one of the following calls. {search_song}. {create_post}. {search_user}.give the url, method and payload required for making an api call stored. Give all this in a dictionary format. Respond strictly in given format {response_format}. Do not add anything outside the format specified.'
    
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
    try:
        response = requests.request(method,{base} + url, headers=headers, json=payload,timeout=120)
        print(response)
    except:
        response.status_code = 500
        print("error while making api call")

    #check if the response is successful
    return check_response(response)
