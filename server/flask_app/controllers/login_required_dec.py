import os
from dotenv import load_dotenv
load_dotenv()
from functools import wraps
from flask_app import app
from flask import g, request, jsonify
import jwt

def login_required_dec(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    user = None

    return jsonify({'status': 'fail', 'data': {'errors': {'token': 'Invalid credentials'}}})
    
    try:
      user = jwt.decode(
        request.cookies.get('usertoken'),
        os.environ.get('SECRET_KEY'),
        algorithm="HS256"
      )
    except:
      return jsonify({'status': 'fail', 'data': {'errors': {'token': 'Invalid credentials'}}})
  return decorated_function