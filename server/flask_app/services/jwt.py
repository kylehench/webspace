import os
from dotenv import load_dotenv
load_dotenv()
import jwt

def id_from_token(usertoken):
  user = jwt.decode(
    usertoken,
    os.environ.get('SECRET_KEY'),
    algorithm="HS256"
  )
  return 