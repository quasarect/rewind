import requests
import pymongo
import logging
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
from io import BytesIO
import openai
from flask import Flask, jsonify,request
from flask_cors import CORS, cross_origin

app = Flask(__name__)

CORS(app)

#Load environment variables from .env file
load_dotenv() 

#connect mongodb
client = pymongo.MongoClient(os.getenv('MONGO_URL'))
db = client["app"]
collection1 = db["users"]
collection2 = db["keys"]

openai.api_key = os.getenv('OPENAI_API_KEY')

#test route
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello World"})

@app.route('/tagline', methods=['GET'])

def generate_tagline():
    user_id = request.headers.get('Authorization').split(' ')[1]
    #user_id = "6439bfa512b767882aee8b9b"
    # get data from db
    result1 = collection1.find_one({"_id": ObjectId(user_id)})
    spotify_id = result1["spotifyData"]
    result2 = collection2.find_one({"_id": ObjectId(spotify_id)})
    access_token = result2["accessToken"]
    refresh_token = result2["refreshToken"]

    #refresh tokens and get user data
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': os.getenv('CLIENT_ID'),
        'client_secret': os.getenv('CLIENT_SECRET'),
        'scope': 'user-top-read',
    }

    response = requests.post(os.getenv('TOKEN_URL'), headers=headers, data=data)

    if response.status_code != 200:
        logging.error(f'Spotify API error: {response.status_code} {response.text}')
        return jsonify({"message": "Error refreshing Spotify access token"}), 500

    access_token = response.json().get('access_token')

    if access_token is None:
        logging.error('Could not retrieve access token')
        return jsonify({"message": "Error retrieving Spotify access token"}), 500

    params = {
        'limit': 10,
        'time_range': 'short_term' 
    }
    headers = {
        'Authorization': 'Bearer ' + access_token
    }

    response = requests.get(os.getenv('ENDPOINTS'), params=params, headers=headers)

    if response.status_code == 200:
        top_artists = response.json()['items']
        top_genres = []
        for artist in top_artists:
            top_genres.extend(artist['genres'])
    else:
        return jsonify({"message": "Error retrieving top genres from Spotify"}), 500


    prompt = f"Write a cool and unique tagline for user whose top genre in music are: { top_genres } Give output just the tagline "
      
    response = openai.Completion.create(
      model="text-davinci-003",
      prompt=prompt,
      temperature=0,
      max_tokens=100,
      top_p=1,
      frequency_penalty=0.2,
      presence_penalty=0
    )

    generated_text = response.choices[0].text.strip()

    return jsonify({"tagline": generated_text})


@app.route('/status/:id', methods=['GET'])
def get_status():
    return jsonify({"status": local_db[request.form['id']]})

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
        #auth_token and userid are hardcoded

    auth = request.headers.get('Authorization').split(' ')[1]
    
    base = os.getenv("BASE_URL")
    
    #various prompts to be used
    create_post = f"when query implies to create a post, use url {base}posts/create and the method is POST and payload consists of only text"
    search_user = f"when query implies to search for user, use url {base}search/username?username=((name)) and the method is GET"
    search_song = f"when query implies to search for song, use url {base}search/song?text=((song)) and the method is GET"
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
        response = requests.request(method, url, headers=headers, json=payload,timeout=120)
        print(response)
    except:
        response.status_code = 500
        print("error while making api call")

    #check if the response is successful
    return check_response(response)




# voice bot route
@app.route('/execute', methods=['GET','POST'])
@cross_origin()
def execute():

    prompt = take_prompt()
    response = execute_command(prompt)
    return jsonify(response)



if __name__ == '__main__':
    app.run(port=5000, debug=True)
