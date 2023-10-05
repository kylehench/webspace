import json
from flask_app import db, api
from flask_restful import Resource
from flask_app.services.decorators import authenticate_admin
from flask_app.models.cached_resource import CachedResource, cached_resource_schema

class CachedResourceCollection(Resource):
  method_decorators = [authenticate_admin]

  def get(self):
    items = db.session.execute(db.select(CachedResource)).scalars().all()
    for item in items:

      # make edits here if desired
      key = json.loads(item.key)
      key['days'] = 3
      value = json.loads(item.value)
      weather_params = ['highs', 'lows', 'weather_symbol']
      for param in weather_params:
        if len(value[param])>4:
          del value[param][0]
      item.key = json.dumps(key, separators=(',', ':'))
      item.value = json.dumps(value, separators=(',', ':'))
      
      pass
    db.session.commit()
    res = []
    for item in items:
      item = cached_resource_schema.dump(item)
      item['key'] = json.loads(item['key'])
      item['value'] = json.loads(item['value'])
      res.append(item)
    return {'cached-resource-collection': res}
  
api.add_resource(CachedResourceCollection, '/api/cached-resource-collection')