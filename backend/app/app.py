import os
import datetime
from flask import Flask
from flask_socketio import SocketIO, send, join_room
# Firebase Admin SDK for Firestore
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
app.config['SECRET_KEY'] = 'testing'

socketio = SocketIO(app, cors_allowed_origins="*")


# firebase configuration 
sa_key_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS', 'serviceAccountKey.json')
if not firebase_admin._apps:
    cred = credentials.Certificate(sa_key_path)
    firebase_admin.initialize_app(cred)
# Firestore client
db = firestore.client()

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

@socketio.on('join')
def handle_join(data):  # data should contain {'chatId': <chatId>}
    chat_id = data.get('chatId') if isinstance(data, dict) else None
    if chat_id:
        join_room(chat_id)
        print(f'Client joined room: {chat_id}')
        send(f'Joined room {chat_id}', room=chat_id)

@socketio.on('chat_message')
def handle_chat_message(data):
    # data should be a dict with keys: chatId, text, sender
    if not isinstance(data, dict):
        return
    chat_id = data.get('chatId')
    text = data.get('text')
    sender = data.get('sender')
    if not chat_id or not text or not sender:
        return
    # Persist message to Firestore under Chat/<chatId>/messages
    try:
        messages_ref = db.collection('Chat').document(chat_id).collection('messages')
        message_data = {
            'text': text,
            'sender': sender,
            'createdAt': datetime.datetime.utcnow()
        }
        # add() returns (DocumentReference, WriteResult)
        doc_ref, _ = messages_ref.add(message_data)
        # Prepare payload including generated ID
        payload = {
            'id': doc_ref.id,
            'text': text,
            'sender': sender,
            'createdAt': message_data['createdAt'].isoformat()
        }
        # Broadcast to all clients in the room
        socketio.emit('chat_message', payload, room=chat_id)
        print(f'Message saved and broadcast in chat {chat_id}:', payload)
    except Exception as e:
        print(f'Error saving message for chat {chat_id}: {e}')
