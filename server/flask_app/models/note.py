from flask_app import db, ma
from datetime import datetime

class Note(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  user_id = db.Column(db.Integer)
  title = db.Column(db.String(100))
  content = db.Column(db.String(int(1e4)))
  titleBgColor = db.Column(db.String(20))
  contentBgColor = db.Column(db.String(20))
  created_utc = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
  updated_utc = db.Column(db.DateTime(timezone=True), onupdate=datetime.utcnow)

  def update(self, new_data):
    for key, val in new_data.items():
      setattr(self, key, val)

class NoteSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Note
    load_instance = True

note_schema = NoteSchema()