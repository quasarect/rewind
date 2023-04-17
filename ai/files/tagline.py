import requests
import pymongo
import logging
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
import openai

#Load environment variables from .env file
load_dotenv() 

openai.api_key = os.getenv('OPENAI_API_KEY')

#connect mongodb
client = pymongo.MongoClient(os.getenv('MONGO_URL'))
db = client["app"]
collection1 = db["users"]
collection2 = db["keys"]

def valid_token(spotify_id, access_token,refresh_token):
    params = {
        'limit': 10,
        'time_range': 'short_term' 
    }
    headers = {
        'Authorization': 'Bearer ' + access_token
    }
    response = requests.get(os.getenv('ENDPOINTS'), params=params, headers=headers)

    if response.status_code == 401:
        # If the access token is invalid refresh it 
        access_token, refresh_token = refresh_spotify_token(spotify_id,refresh_token)
        return valid_token(spotify_id, access_token, refresh_token)
    else:
        # If the access token is valid
        top_artists = response.json()['items']
        top_genres = []
        for artist in top_artists:
            top_genres.extend(artist['genres'])
        return top_genres


def refresh_spotify_token(spotify_id, refresh_token):
    try:
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
            return {"message": "Error refreshing Spotify access token"}, 500

        new_access_token = response.json().get('access_token')
        new_refresh_token = refresh_token

        result = collection2.update_one({"_id": ObjectId(spotify_id)}, 
            {"$set": {"accessToken": new_access_token, "refreshToken": new_refresh_token}})
        if result.modified_count > 0:
            print("Access token and refresh token updated successfully.")
            print(new_access_token)
            print(new_refresh_token)
        else:
            print("Access token and refresh token not updated.")


        if new_access_token is None:
            logging.error('Could not retrieve access token')
            return {"message": "Error retrieving Spotify access token"}, 500
        
        return new_access_token, new_refresh_token
    except Exception as e:
        logging.error(f'Error refreshing Spotify access token: {e}')
        return {"message": "Error refreshing Spotify access token"}, 500


def generate_tagline(user_id):
    try:
        # get data from db
        result1 = collection1.find_one({"_id": ObjectId(user_id)})
        spotify_id = result1["spotifyData"]
        result2 = collection2.find_one({"_id": ObjectId(spotify_id)})
        access_token = result2["accessToken"]
        refresh_token = result2["refreshToken"]
        print(access_token)
        print(refresh_token)
        top_genres = valid_token(spotify_id, access_token, refresh_token)
        print(top_genres)
        prompt = f"Create a catchy tagline that describes the mood of music lovers who enjoy genres like { top_genres } The tagline should create a strong emotional response. Do not use words like you, your, our, us in the tagline. Create a tagline that speaks to the user's personal experience and connection to the music. "
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages= [{"role": "system", "content": "hello world"},
            {"role": "user", "content": prompt}],
            # temperature=0.7,
            # max_tokens=100,
            # top_p=1,
            # frequency_penalty=0,
            # presence_penalty=0
        )

        generated_text = response.choices[0]['message']['content']

        return {"tagline": generated_text}
    except Exception as e:
        logging.error(f'Error generating tagline: {e}')
        return {"message": "Error generating tagline"}, 500
