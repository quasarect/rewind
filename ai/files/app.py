from flask import Flask, jsonify, request, session
from flask_cors import CORS, cross_origin
from tagline import generate_tagline
from voicebot import take_prompt, execute_command, initialize_status, check_status
from decode import decode_jwt

app = Flask(__name__)
app.secret_key = "jgyfuysavdfuiwieguefsduhgwqoiAJSXHNBUVDB"


CORS(app)

#test route
@app.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello World"})

#tagline generation route
@app.route('/tagline', methods=['GET'])
def tagline():
    user_id = request.headers.get('Authorization').split(' ')[1]
    #user_id = "643c5295f84864c678dfb5cb"
    return generate_tagline(user_id)

# voice bot route
@app.route('/execute', methods=['GET','POST'])
@cross_origin()
def execute():
    token = request.headers.get('Authorization').split(' ')[1]
    user_id = decode_jwt(token)
    print("user: ", user_id)

    status_id = initialize_status(user_id)

    request.user_id = user_id
    prompt = take_prompt()
    if not prompt:
        return jsonify({"error": "something went wrong during transcription"})
    
    execute_command(prompt)
    return str(status_id)

@app.route('/execute/status', methods=['GET'])
def get_status():
    token = request.headers.get('Authorization').split(' ')[1]
    user_id = decode_jwt(token)
    print(user_id)
    if user_id is not None:
        return check_status(user_id) 
    else:
        return 'Status not found!'


if __name__ == '__main__':
    app.run(port=5000, debug=True, host='0.0.0.0')