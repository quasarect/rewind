import unittest
from unittest.mock import patch
from flask import Flask, request
import json
import sys
sys.path.append('C:\\Users\\Smruti\\Desktop\\rewind\\ai\\files')
from voicebot import execute_command


class TestExecuteCommand(unittest.TestCase):
    
    
    def test_execute_command(self):
        
        app = Flask(__name__)
        app.config["TESTING"] = True
        
        test_cases = [
            # test creating a post
            {
                "prompt": "I want to make a new post",
                "expected_output": "make a post || create a post",
                "expected_description": "create a post based on the user's input"
            },
            # test searching for a song
            {
                "prompt": "Can you search for a song?",
                "expected_output": "search for song",
                "expected_description": "search for a song based on the user's input"
            }
        ]
        
        with self.app.test_client() as client:
            for test_case in test_cases:
                with self.subTest(test_case=test_case):
                    response = execute_command(test_case["prompt"], client)
                    self.assertEqual(response["name"], test_case["expected_output"])

if __name__ == '__main__':
    unittest.main()
