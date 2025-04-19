from flask import Flask
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'testing'

socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/hello', methods=['GET'])
def hello():
    return 'hello hello'

@socketio.on('connect')
def handle_connect():
    print('Client connected hahahaha')
    send('Connected to server')

@socketio.on('message')
def handle_message(msg):
    print('Received message:', msg)
    send('reply: ' + msg)