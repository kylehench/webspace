from flask_app import app

@app.route('/')
def home():
  return 'hello'