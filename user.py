import base64
from datetime import datetime, timedelta
import os

class User():
    # a couple of attributes

    # creating a token ... we assume that a user already signed up to the service
    def generate_token(self, expires_in=3600):
        now = datetime.utcnow()
        self.token = base64.b64encode(os.urandom(24)).decode('utf-8')
        self.token_expiration = now + timedelta(seconds=expires_in)

    def get_token(self):
        now = datetime.utcnow()
        if self.token and self.token_expiration > now + timedelta(seconds=60):
            return self.token
        else:
            generate_token()
            return self.token

    def check_token(self, token):
        if self.token == token:
            n = datetime.utcnow() + timedelta(seconds=60)
            if self.token_expiration > n:
                print(self.token_expiration, n)
                return True
        else:
            return False

