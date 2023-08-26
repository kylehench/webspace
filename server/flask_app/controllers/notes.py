from flask import g
from flask_app import app, db
from flask_restful import abort, Api, Resource, request
from flask_app.models.note import Note, note_schema
from flask_marshmallow import exceptions
from flask_app.services.decorators import authenticate

api = Api(app)

def get_note_and_authorize(note_id):
  note = db.get_or_404(Note, note_id)
  if note.user_id != g.user_id:
    abort(401, message="You do not have permission access this resource.")
  return note

class NoteResource(Resource):
  method_decorators = [authenticate]
  
  def get(self, note_id):
    note = get_note_and_authorize(note_id)
    return {'note': note_schema.dump(note)}
  
  def patch(self, note_id):
    note = get_note_and_authorize(note_id)
    note_updates = request.get_json()
    validation_errors = note_schema.validate(note_updates)
    if validation_errors:
      return {'errors': validation_errors}, 400
    note.patch(note_updates)
    db.session.commit()
    return '', 204
  
  def delete(self, note_id):
    note = get_note_and_authorize(note_id)
    db.session.delete(note)
    db.session.commit()
    return '', 204



class NoteListResource(Resource):
  method_decorators = [authenticate]
  
  def get(self):
    # returns id and titles of user's notes in updated order (descending)
    notes = db.session.execute(db.select(Note.id, Note.title).where(Note.user_id == g.user_id).order_by(Note.updated_utc.desc()))
    return [{"id": id, "title": title} for id, title in notes]
  
  def post(self):
    try:
      note = note_schema.load(request.get_json() | {'user_id': g.user_id})
      note.id = None
    except exceptions.ValidationError as errors:
      return {'errors': errors.messages}, 400
    db.session.add(note)
    db.session.commit()
    return note.id, 201
  
# setup API resource routing
api.add_resource(NoteResource, '/api/notes/<note_id>')
api.add_resource(NoteListResource, '/api/notes')