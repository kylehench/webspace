from flask_app import db, ma
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

class Quote(db.Model):
  id = Column(Integer, primary_key=True)
  text = Column(String(500))
  author = Column(String(50))
  created_utc = Column(DateTime(timezone=True), default=datetime.utcnow)
  updated_utc = Column(DateTime(timezone=True), onupdate=datetime.utcnow)

class QuoteSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Quote
    load_instance = True

quote_schema = QuoteSchema()