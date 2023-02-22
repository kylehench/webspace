import os
from dotenv import load_dotenv
load_dotenv()
import jwt

def user_id_from_token(request):
  decrypted_token = jwt.decode(
    request.cookies.get('usertoken'),
    os.environ.get('SECRET_KEY'),
    algorithms="HS256"
  )
  return decrypted_token['user_id']