from pymongo import MongoClient
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
import openai
import time
import json
from flask import request, jsonify, make_response

#Load environment variables from .env file
load_dotenv() 

openai.api_key = os.getenv("OPENAI_API_KEY")

client = MongoClient(os.getenv("MONGO_URL"))
db = client["app"]
collection = db["voicebot_status"]

# voice bot functions
#check if the response is successful

def get_doc(document):
    if document:
        document["_id"] = str(document["_id"])
        return document
    else:
        return None

def check_status(user_id):

    try:
        # Retrieve the status of the process
        status = collection.find_one({'user_id': user_id})

        if status is None:
            return make_response(jsonify({"message" : "not found"}), 404)
        
        return make_response(jsonify({"status" : get_doc(status)}), 200)
    except Exception as e:
        print(e)
        return make_response(jsonify({"message": "server error"}), 500)

#initializing the mongoDB document for the request
def initialize_status(user_id):
    try:
        initial_status = { "user_id": user_id,"status": "started"}

        res = collection.find_one(
            {
                "user_id": user_id
            }
        )

        if res is None:
            result = collection.insert_one(initial_status)
        else:
            result = collection.replace_one({"user_id": user_id},initial_status, upsert=True)

        #print(result)
        
        return str(result["_id"])
    except Exception as error:
        print(error)
        return error

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
        filter_query = {"user_id": request.user_id}
        update_query = {"$set": {"status": "error", "error": "error in transcription"}}
        collection.update_one(filter_query, update_query)
        pass

    #update status of in mongoDB
    filter_query = {"user_id": request.user_id}
    update_query = {"$set": {"status": "transcribed","prompt": transcript}}
    collection.update_one(filter_query, update_query)
        
    return transcript


#execute the command received from the prompt
def execute_command(prompt):

    print("prompt",prompt)
    
    #get the commands to provide the prompt from the apis.json file
    try:
        file = open("./files/apis.json", "r")
        command_id = []
        command_name = []
        command_description = []

        api_format = json.load(file)

        for x in api_format:
            command_id.append(x['id'])
            command_name.append(x['name'])
            command_description.append(x['description'])
    except Exception as err:
        print(err)
        filter_query = {"user_id": request.user_id}
        update_query = {"$set": {"status": "error", "error": "error in finding apis.json"}}
        collection.update_one(filter_query, update_query)
        return err
        
        
    #user prompt to identify the command    
    user_prompt = f'categorize {prompt}. id {command_id}. name {command_name}. description {command_description}.'
    
    #provide the prompt to the openai api
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= [{"role": "system", "content": "only single id as output without extra space. No explaination."},
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
        id = int(response)
    except ValueError:
        id = 0
    except Exception as e:
        print(e)
        filter_query = {"user_id": request.user_id}
        update_query = {"$set": {"status": "error", "error": "error in extracting api details"}}
        collection.update_one(filter_query, update_query)
        return e
     

    print(api_format[id])
        
    #get the format of the api call from the apis.json file
    var = "{{}}"
    user_prompt = f'user prompt: {prompt}.\n Specified format: {api_format[id]}.\n the specified format has variable values in double curly braces, example : {var}. Fill it with appropriate data from user prompt '
    
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
    filter_query = {"user_id": request.user_id}
    update_query = {"$set": {"status": "processed"}}
    collection.update_one(filter_query, update_query)
    
    try:
        if eval(response):
            response = eval(response)
    except SyntaxError:
            response = api_format[0]
    except Exception as e:
        print(e)
        filter_query = {"user_id": request.user_id}
        update_query = {"$set": {"status": "error", "error": "error in extracting formatted response"}}
        collection.update_one(filter_query, update_query)
        return e
    
    #print(response) 
    
    filter_query = {"user_id": request.user_id}
    update_query = {"$set": {"status": "completed", "success": response}}
    collection.update_one(filter_query, update_query)

    return
