from flask_app import app, db, ma
from flask_restful import abort, Api, Resource, request
from flask_app.models.note import Note, note_schema
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
    note = db.session.execute(db.select(Note)
      .where(Note.id==note_id)
    ).scalar()
    # check permission to view note
    if note.user_id != user_id:
      abort(401, message="You do not have authorization to view this resource.")
    return {'note': note_schema.dump(note)}
  
  def put(self, note_id):
    user_id = get_user_id()
    note = db.session.scalar(db.select(Note).where(Note.id == note_id))
    # check permission to update note
    if user_id != note.user_id:
      abort(401, message="You do not have authorization to edit this resource.")
    request_data = note_schema.load(request.get_json())
    request_data.user_id = None
    note.update({key: val for key, val in note_schema.dump(request_data).items() if val != None})
    db.session.commit()
    return '', 204
  
  def delete(self, note_id):
    user_id = get_user_id()
    note = db.session.get(Note, note_id)
    if not note or note.user_id != user_id:
      abort(401, message="Invalid request.")
    db.session.delete(note)
    db.session.commit()
    return '', '204'



class NoteListResource(Resource):
  def get(self):
    user_id = get_user_id()
    # note: returns id and titles of user's notes in updated order (descending)
    notes = db.session.execute(db.select(Note.id, Note.title).where(Note.user_id == user_id).order_by(Note.updated_utc.desc()))
    notes = [{"id": id, "title": title} for id, title in notes]
    return notes
  
  def post(self):
    user_id = get_user_id()
    note = note_schema.load(request.get_json())
    note.user_id = user_id
    db.session.add(note)
    db.session.commit()
    return note.id, 201
  
# setup API resource routing
api.add_resource(NoteResource, '/api/notes/<note_id>')
api.add_resource(NoteListResource, '/api/notes')