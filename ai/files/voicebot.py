import requests
import pymongo
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
from io import BytesIO
from pydub import AudioSegment
import openai
import json
from flask import request

#Load environment variables from .env file
load_dotenv() 

# voice bot functions
#take audio file and transcribe into text format. To be edited further
def take_prompt():

    try:
        audio_file = request.files['audio']
        audio_file.save(audio_file.filename)
        with open(audio_file.filename, 'rb') as f:
            transcript = openai.Audio.transcribe("whisper-1", f, response_format="text")

    

    except Exception as error:
        transcript = None
        print(error)
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
    
   
    with open("apis.json", "r") as file:
        api_format = json.load(file)  
    

    command_id = []
    command_name = []
    command_description = []


    for x in api_format:
        command_id.append(x['id'])
        command_name.append(x['name'])
        command_description.append(x['description'])
        
        
    #user prompt to identify the command    
    user_prompt = f'categorize {prompt}. id {command_id}. name {command_name}. description {command_description}.'
    
    #provide the prompt to the openai api
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= [{"role": "system", "content": "only id as output. No explaination."},
        {"role": "user", "content": user_prompt}],
        #temperature=0.5,
        max_tokens=9,
        # top_p=1,
        # frequency_penalty=0,
        # presence_penalty=0
    )

    try:
        #receive the response from the openai api and convert it to a dictionary
            #response will be in an integer
        response = response['choices'][0]['message']['content']
        #print(response)
        id = int(response)
    except ValueError:
        id = 0
    except Exception as e:
        print(e)
     
        
    #get the format of the api call from the apis.json file
    user_prompt = f'{prompt}. Specified format: {api_format[id]}. fill the values in curly braces of the given format.'
    
    #provide the prompt to the openai api
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= [{"role": "system", "content": "only format specified as output. No explaination."},
        {"role": "user", "content": user_prompt}],
        #temperature=0.5,
        #max_tokens=9,
        # top_p=1,
        # frequency_penalty=0,
        # presence_penalty=0
    )
    response = response['choices'][0]['message']['content']
    
    try:
        if eval(response):
            response = eval(response)
    except SyntaxError:
            response = api_format[0]
    except Exception as e:
        print(e)
            
    print(response)
    
    ###########work on this part later###########
    try:
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
    
    except Exception as e:
        print(e)
        return {'error': 'error while making api call'}
