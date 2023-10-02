from flask_app import app
from flask_app.services import authorization
from flask import g
from flask_restful import request, abort
from functools import wraps

def authenticate_user(func):
  @wraps(func)
  def wrapper(*args, **kwargs):
    try:
      g.user_id = authorization.user_id_from_token(request)
    except PermissionError as e:
      abort(401, message=str(e))
    return func(*args, **kwargs)
  return wrapper

def authenticate_admin(func):
  @wraps(func)
  def wrapper(*args, **kwargs):
    if request.headers.get('Authorization') != app.config['SECRET_KEY']:
      abort(401)
    return func(*args, **kwargs)
  return wrapper