import os
from dotenv import load_dotenv
load_dotenv()
import jwt
from datetime import datetime, timezone

def user_id_from_token(request):
  decrypted_token = jwt.decode(
    request.cookies.get('usertoken'),
    os.environ.get('SECRET_KEY'),
    algorithms="HS256"
  )
  expires = datetime.fromisoformat(decrypted_token['expires'])
  # check that token has not expired
  if expires < datetime.now(timezone.utc):
    raise PermissionError()
  return decrypted_token['user_id']