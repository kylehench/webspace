from flask_app import app
import jwt
from datetime import datetime, timezone

def user_id_from_token(request):

  # CSRF protection resource
  # https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#custom-request-headers
  if request.headers.get('X-WEBSPACE-CSRF-PROTECTION') != '1':
    raise PermissionError('CSRF header missing.')

  # decrypt jwt
  try:
    decrypted_token = jwt.decode(
      request.cookies.get('usertoken'),
      app.config['SECRET_KEY'],
      algorithms="HS256"
    )
  except:
    raise PermissionError('Login required')

  # check that token has not expired
  expires = datetime.fromisoformat(decrypted_token['expires'])
  if expires < datetime.now(timezone.utc):
    raise PermissionError('Token expired')
  
  return decrypted_token['user_id']