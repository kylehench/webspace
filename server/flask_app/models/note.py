from flask_app import db, ma
from datetime import datetime

class Note(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer)
  title = db.Column(db.String(50))
  content = db.Column(db.String(50))
  created_at = db.Column(db.String(255), default=datetime.now)
  updated_at = db.Column(db.String(255), default=datetime.now, onupdate=datetime.now)

class NoteSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Note
    load_instance = True

note_schema = NoteSchema()