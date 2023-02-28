from flask_app import db, ma
from datetime import datetime

class Note(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer)
  title = db.Column(db.String(100))
  content = db.Column(db.String(int(1e4)))
  titleBgColor = db.Column(db.String(20))
  contentBgColor = db.Column(db.String(20))
  created_at = db.Column(db.String(255), default=datetime.now)
  updated_at = db.Column(db.String(255), default=datetime.now, onupdate=datetime.now)

  def update(self, new_data):
    for key, val in new_data.items():
      setattr(self, key, val)

class NoteSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Note
    load_instance = True

note_schema = NoteSchema()