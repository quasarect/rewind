import sys
sys.path.append('C:\\Users\\91940\\Desktop\\rewind\\ai\\files')
from tagline import generate_tagline
import unittest
from unittest.mock import patch
from flask import Flask
from bson.objectid import ObjectId

class TestGenerateTagline(unittest.TestCase):

    @patch('tagline.collection1.find_one')
    @patch('tagline.collection2.find_one')
    @patch('tagline.valid_token')
    def test_generate_tagline(self, mock_valid_token, mock_collection2_find_one, mock_collection1_find_one):
        app = Flask(__name__)
        app.config['TESTING'] = True

        with app.app_context():
            mock_collection1_find_one.return_value = {
            'spotifyData': ObjectId('643c5295f84864c678dfb5c9')
            }
            mock_collection2_find_one.return_value = {
            'accessToken': 'access_token',
            'refreshToken': 'refresh_token'}
            mock_valid_token.return_value = ["rock", "pop", "indie"]
            response = generate_tagline(ObjectId('643c5295f84864c678dfb5cb'))

            self.assertEqual(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
