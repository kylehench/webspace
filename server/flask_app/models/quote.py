from flask_app import db, ma
from datetime import datetime

class Quote(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  text = db.Column(db.String(500))
  author = db.Column(db.String(50))
  created_at = db.Column(db.String(255), default=datetime.now)
  updated_at = db.Column(db.String(255), default=datetime.now, onupdate=datetime.now)

class QuoteSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = Quote
    load_instance = True

quote_schema = QuoteSchema()