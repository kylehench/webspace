from flask_app import db

class User(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  email = db.Column(db.String(64), unique=True, index=True)
  # password = db.Column(db.String(128))
  name = db.Column(db.String(50))
  name2 = db.Column(db.String(50))
  name3 = db.Column(db.String(50))