from flask_app import db
import datetime

class Note(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  title = db.Column(db.String(50))
  content = db.Column(db.String(50))
  created_at = db.Column(db.String, default=datetime.now)
  updated_at = db.Column(db.String, default=datetime.now, onupdate=datetime.now)