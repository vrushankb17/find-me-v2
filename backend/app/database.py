from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = "findme_db"

client = None
db = None

def connect_to_mongo():
    global client, db
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    print(f"Connected to MongoDB at {MONGO_URL}")

def close_mongo_connection():
    if client:
        client.close()
        print("Closed MongoDB connection")

def get_db():
    return db
