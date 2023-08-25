from flask_app import app, db
from flask_restful import abort, Api, Resource, request
from flask_app.models.note import Note, note_schema
from flask_marshmallow import exceptions
from flask_app.services.authorization import user_id_from_token

api = Api(app)

def get_user_id():
  try:
    user_id = user_id_from_token(request)
    return user_id
  except PermissionError as e:
    abort(401, message=str(e))

class NoteResource(Resource):
  def get(self, note_id):
    user_id = get_user_id()
    note = db.get_or_404(Note, note_id)
    # check permission to view note
    if note.user_id != user_id:
      abort(401, message="You do not have authorization to view this resource.")
    return {'note': note_schema.dump(note)}
  
  def patch(self, note_id):
    user_id = get_user_id()
    note = db.get_or_404(Note, note_id)
    # check permission to update note
    if user_id != note.user_id:
      abort(401, message="You do not have authorization to edit this resource.")
    note_updates = request.get_json()
    validation_errors = note_schema.validate(note_updates)
    if validation_errors:
      return {'errors': validation_errors}, 400
    note.patch(note_updates)
    db.session.commit()
    return '', 204
  
  def delete(self, note_id):
    user_id = get_user_id()
    note = db.session.get(Note, note_id)
    if not note or note.user_id != user_id:
      abort(401, message="Invalid request.")
    db.session.delete(note)
    db.session.commit()
    return '', 204



class NoteListResource(Resource):
  def get(self):
    user_id = get_user_id()
    # note: returns id and titles of user's notes in updated order (descending)
    notes = db.session.execute(db.select(Note.id, Note.title).where(Note.user_id == user_id).order_by(Note.updated_utc.desc()))
    notes = [{"id": id, "title": title} for id, title in notes]
    return notes
  
  def post(self):
    user_id = get_user_id()
    try:
      note = note_schema.load(request.get_json() | {'user_id': user_id})
      note.id = None
    except exceptions.ValidationError as errors:
      return {'errors': errors.messages}, 400
    db.session.add(note)
    db.session.commit()
    return note.id, 201
  
# setup API resource routing
api.add_resource(NoteResource, '/api/notes/<note_id>')
api.add_resource(NoteListResource, '/api/notes')