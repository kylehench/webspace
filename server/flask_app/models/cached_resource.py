from flask_app import db, ma
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from jinja2 import Template

class CachedResource(db.Model):
  id = Column(Integer, primary_key=True)
  key = Column(String(256))
  value = Column(Text)
  created_utc = Column(DateTime(timezone=True), default=datetime.utcnow)

class CachedResourceSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = CachedResource
    load_instance = True

cached_resource_schema = CachedResourceSchema()

class CachedResourceRepository():
  def __init__(self, url_template_str, expiration, auth=None):
    self.url_template = Template(url_template_str)
    self.expiration = expiration
    self.auth = auth

  def get(self, url_args):
    url = self.url_template.render(**url_args)
    # check if object is in database and not expired
