'''used to manually create users with password hash'''

from pymongo import MongoClient
from werkzeug.security import generate_password_hash


DB_CLIENT = MongoClient("mongodb+srv://batteryassembly:jYzrBpC26emVYaa6@batteryassembly.vcqm1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

user_registration = {
    "name": "rian",
    "email": "rian.boutin@student.fairfield.edu",
    "password": "1234"
}

def register(user_input):
    user_input = {
        'name': user_input["name"],
        'email': user_input["email"],
        'password': generate_password_hash(user_input["password"])
    }
    DB_CLIENT.users['admin'].insert_one(user_input)
    print('Congratulations, you are now a registered user!')

register(user_input=user_registration)
