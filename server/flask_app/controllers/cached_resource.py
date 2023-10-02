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
      item.value = json.dumps(json.loads(item.value) | {'source': 'meteomatics'})
      
      pass
    db.session.commit()
    return {'cached-resource-collection': [cached_resource_schema.dump(item) for item in items]}
  
api.add_resource(CachedResourceCollection, '/api/cached-resource-collection')