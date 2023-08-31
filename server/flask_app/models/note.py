from flask_app import db, ma
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime

class Note(db.Model):
  id = Column(Integer, primary_key=True)
  user_id = Column(Integer)
  title = Column(String(100))
  content = Column(Text())
  checkboxes_visible = Column(Boolean)
  checked = Column(Text()) # row idxs of content marked as "checked"
  titleBgColor = Column(String(20))
  contentBgColor = Column(String(20))
  created_utc = Column(DateTime(timezone=True), default=datetime.utcnow)
  updated_utc = Column(DateTime(timezone=True), onupdate=datetime.utcnow)

  def patch(self, new_data, safe=True):
    if safe:
      exclude_keys = ['id', 'user_id']
      for key in exclude_keys:
        if key in new_data:
          del new_data[key]
    for key, val in new_data.items():
      setattr(self, key, val)

class NoteSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Note
    load_instance = True

note_schema = NoteSchema()