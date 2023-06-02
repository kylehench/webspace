from flask_app import db, ma
from datetime import datetime

class Quote(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  text = db.Column(db.String(500))
  author = db.Column(db.String(50))
  created_utc = db.Column(db.DateTime(timezone=True), default=datetime.utcnow)
  updated_utc = db.Column(db.DateTime(timezone=True), onupdate=datetime.utcnow)

class QuoteSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Quote
    load_instance = True

quote_schema = QuoteSchema()