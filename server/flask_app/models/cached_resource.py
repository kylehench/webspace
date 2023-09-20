import json
from flask_app import db, ma
from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime, timedelta

max_key_length = 256

class CachedResource(db.Model):
  id = Column(Integer, primary_key=True)
  key = Column(String(max_key_length))
  value = Column(Text)
  created_utc = Column(DateTime(timezone=True), default=datetime.utcnow)

class CachedResourceSchema(ma.SQLAlchemyAutoSchema):
  class Meta:
    model = CachedResource
    load_instance = True

cached_resource_schema = CachedResourceSchema()

class CachedResourceRepository():
  def __init__(self, resource_name: String, expiration_hours: Integer):
    self.resource_name = resource_name
    self.expiration_timedelta = timedelta(hours=expiration_hours)

  def __get_key(self, request_args: dict):
    key = json.dumps({'resource_name': self.resource_name} | request_args, separators=(',', ':'))
    if len(key) > max_key_length:
      raise KeyError(f'Length of request args dict exceeds {max_key_length} characters')
    return key

  def get(self, request_args: dict):
    key = self.__get_key(request_args)
    resource = db.session.execute(db.select(CachedResource).where(CachedResource.key == key).order_by(CachedResource.created_utc.desc())).scalar()
    if not resource:
      return
    # ensure resource is not expired
    if datetime.utcnow() - resource.created_utc > self.expiration_timedelta:
      return
    return resource.value
  
  def set(self, request_args, data: dict):
    key = self.__get_key(request_args)
    resource = cached_resource_schema.load({
      'key': key,
      'value': json.dumps(data, separators=(',', ':'))
    })
    db.session.add(resource)
    db.session.commit()