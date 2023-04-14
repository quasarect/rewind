import requests
import pymongo
import jwt
import logging
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
import openai
from flask import Flask, jsonify,request

app = Flask(__name__)

#Load environment variables from .env file
load_dotenv() 

#connect mongodb
client = pymongo.MongoClient(os.getenv('MONGO_URL'))
db = client["app"]
collection1 = db["users"]
collection2 = db["keys"]


@app.route('/', methods=['GET'])

def generate_tagline():

    ################ithe header ch bagh mala te kalla nhi
    auth_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MzkzZDQ2ODZkMDEwMjczNTZlMzk3ZSIsInVzZXJuYW1lIjoidXNlciIsImlhdCI6MTY4MTQ3Mjk1NiwiZXhwIjoxNjgyMDc3NzU2fQ.UKhFLzgMj4ca9_uApel_yEXdQeX7CO-80Q4zSp2xiOU'

    #decode authentication token
    try:
        decoded_token = jwt.decode(auth_token, os.getenv('JWT_SECRET'), algorithms=['HS256'])
        user_id = decoded_token["id"]
    except jwt.exceptions.InvalidSignatureError:
        return jsonify({"message": "Invalid token signature"}), 401

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

    openai.api_key = os.getenv('OPENAI_API_KEY')

    prompt = f"Write a cool tagline for user whose top genre in music are: { top_genres } Give output just the tagline "
      
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

    myquery = {"_id": ObjectId(user_id)}
    newvalues = { "$set": {"tag": generated_text } }

    collection1.update_one(myquery, newvalues)

    return jsonify({"tagline": generated_text})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
