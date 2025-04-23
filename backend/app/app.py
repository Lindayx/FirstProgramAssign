import os
import datetime
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, send, join_room
# Firebase Admin SDK for Firestore
import firebase_admin
from firebase_admin import credentials, firestore
import requests as http_requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:8081"}})
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

import requests as http_requests

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        data = request.get_json()
        print("Received data:", data)

        # Make sure all required fields are present
        required_fields = ["to_email", "to_name", "pet_name", "adopter_name", "adopter_email"]
        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"Missing required field: {field}")

        # Send email via EmailJS
        response = http_requests.post(
            'https://api.emailjs.com/api/v1.0/email/send',
            headers={'origin': 'http://localhost'},  # EmailJS requires this
            json={
                'service_id': 'service_9fhpvng',
                'template_id': 'template_kx3u6ub',
                'user_id': 'jguHc5uFzt4Mes9dK',
                'template_params': {
                    'to_email': data['to_email'],
                    'to_name': data['to_name'],
                    'pet_name': data['pet_name'],
                    'adopter_name': data['adopter_name'],
                    'adopter_email': data['adopter_email'],
                }
            }
        )

        print("EmailJS status code:", response.status_code)
        print("EmailJS response:", response.text)

        if response.status_code != 200:
            raise Exception(f"EmailJS failed: {response.text}")

        return jsonify({"status": "Email sent"}), 200

    except Exception as e:
        import traceback
        print("❌ ERROR in /send-email")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
