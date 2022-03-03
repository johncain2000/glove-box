from flask import Flask
from flask import request, jsonify
from flask_httpauth import HTTPTokenAuth

from user import User

app = Flask(__name__)
app.config["DEBUG"] = True
auth = HTTPTokenAuth()

# our data: a list of books that can be retrieved through REST APIs
plc_data = [ 
    #connection to OAS software
]


#create instance of a user 
u.generate_token()
print("The token of the user is", u.token)

#validate the token 
@auth.verify_token
def verify_token( token ):
    print("The token past by the browser is", token )
    return u.check_token(token)


# REST API endpoint to list data
@app.route('/IP_ADDRESS:5000/ ', methods=['GET'])
@auth.login_required
def api_all():
    return jsonify(plc_data)


if __name__ == "__main__":
    app.run()

