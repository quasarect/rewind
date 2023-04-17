from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from tagline import generate_tagline
from voicebot import take_prompt, execute_command

app = Flask(__name__)

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
    prompt = take_prompt()
    if not prompt:
        return jsonify({"error": "something went wrong during transcription"})
    response = execute_command(prompt)
    return jsonify(response)


if __name__ == '__main__':
    app.run(port=5000, debug=True)