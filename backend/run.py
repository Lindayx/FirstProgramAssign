import sys
# from server import app, socketio
from app.app import app, socketio

def run():
    print("Starting Flask-SocketIO server on http://0.0.0.0:5000 (debug + auto-reload enabled)")
    try:
        # debug mode, change when deploying
        app.config['DEBUG'] = True
        socketio.run(app,
                     host='0.0.0.0',
                     port=5000)
        print("server has stopped.")
    except Exception as e:
        print(f"error {e}", file=sys.stderr)

if __name__ == '__main__':
    run()
