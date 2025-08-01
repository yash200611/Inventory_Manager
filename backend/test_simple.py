from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello():
    return {'message': 'Hello World!'}

@app.route('/test')
def test():
    return {'status': 'ok'}

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(debug=True, host='localhost', port=5000) 