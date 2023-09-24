import os
import motor.motor_asyncio

MONGO_DETAILS = os.environ.get('MONGO_DETAILS')

client = motor.motor_asyncio.AsyncIOMotorClient(MONGO_DETAILS)

database = client.ruby_ring

ring_collection = database.get_collection("ruby_ring_collection")