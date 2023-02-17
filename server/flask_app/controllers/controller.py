from flask_app import app, db
from flask_app.models.user import User

@app.route('/')
def home():

  # u = User(name='john', email='john@example.com')
  # db.session.add(u)
  # db.session.commit()
  
  return 'hello'