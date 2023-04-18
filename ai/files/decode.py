import jwt
import os
from flask import jsonify, make_response

def decode_jwt(token):

    try:
        decoded = jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms=['HS256'])
        user_id = decoded['id']
        
    except Exception:
        user_id = None
        return make_response(jsonify({"message" : "Couldn't get user_id"}),404)

    return user_id