import jwt
import os

def decode_jwt(token):

    try:
        decoded = jwt.decode(token, os.environ.get('JWT_SECRET'), algorithms=['HS256'])
        user_id = decoded['id']
        return user_id
    except Exception as error:
        user_id = None
        print(error)

    return user_id