from flask import Flask, jsonify, request, make_response
from flask_cors import CORS, cross_origin
from tagline import generate_tagline
from voicebot import take_prompt, execute_command, initialize_status, check_status
from decode import decode_jwt

app = Flask(__name__)

CORS(app)

#test route
@app.route('/test', methods=['GET'])
def test():
    return make_response(jsonify({"message": "Hello World"}),200)

#tagline generation route
@app.route('/tagline', methods=['GET'])
@cross_origin()
def tagline():
    try:
        
        user_id = request.headers.get('Authorization').split(' ')[1]

    except AttributeError:

        return make_response(jsonify({"message": "no user found"}), 404)
    #user_id = "6439bfa512b767882aee8b9b"
    return generate_tagline(user_id)

# voice bot route
@app.route('/execute', methods=['GET','POST'])
@cross_origin()
def execute():
    token = request.headers.get('Authorization').split(' ')[1]
    #print(token)
    user_id = decode_jwt(token)

    if user_id is None:
        return make_response(jsonify({"message" : "Unauthorizeed"}), 401)

    status_id = initialize_status(user_id)

    request.user_id = user_id
    prompt = take_prompt()
    if prompt is None:
        return  make_response(jsonify({"message" : "something went wrong during transcription"}),404)
    
    execute_command(prompt)
    return str(status_id)

@app.route('/execute/status', methods=['GET'])
def get_status():
    token = request.headers.get('Authorization').split(' ')[1]
    user_id = decode_jwt(token)
    if user_id is not None:
        return check_status(user_id) 
    else:
        return make_response(jsonify({"message" : "not found"}), 404)


if __name__ == '__main__':
    app.run(port=5000, debug=True, host='0.0.0.0', threaded=True)