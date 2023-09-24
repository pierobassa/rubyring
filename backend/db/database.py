import os
import motor.motor_asyncio

MONGO_URI = os.environ.get('MONGO_URI')
DB_NAME = os.environ.get('DB_NAME')

if not MONGO_URI:
    raise ValueError("MONGO_URI is not defined")

if not DB_NAME:
    raise ValueError("DB_NAME is not defined")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)

database = client[DB_NAME]

ring_collection = database.get_collection("ruby_ring_collection")