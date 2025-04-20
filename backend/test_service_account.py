#!/usr/bin/env python3
import os
import sys

#for the sake of testing service account key

try:
    import firebase_admin
    from firebase_admin import credentials, firestore
except ImportError:
    print("Error: firebase_admin not installed. Please run 'pip install firebase-admin'", file=sys.stderr)
    sys.exit(1)

def main():
    # Path to your service account key JSON
    script_dir = os.path.dirname(os.path.abspath(__file__))
    key_path = os.path.join(script_dir, 'serviceAccountKey.json')
    if not os.path.exists(key_path):
        print(f"Service account key file not found at {key_path}", file=sys.stderr)
        sys.exit(1)

    try:
        # Initialize the app with a service account, granting admin privileges
        cred = credentials.Certificate(key_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        # Attempt to fetch collections as a connectivity test
        collections = db.collections()
        names = [col.id for col in collections]
        print("Successfully connected to Firestore.")
        if names:
            print("Top-level collections:", ", ".join(names))
        else:
            print("No top-level collections found (your database may be empty).")
        sys.exit(0)
    except Exception as e:
        print(f"Error connecting to Firestore: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()