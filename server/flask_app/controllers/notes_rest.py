from flask_app import app, db
from flask_restful import reqparse, abort, Api, Resource, request
import flask_app.models.note
from flask_app.models.note import Note, NoteSchema
from flask_app.services.authorization import user_id_from_token

api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('title')
parser.add_argument('content')

class NoteResource(Resource):
  def get(self):
    return ''

class NoteListResource(Resource):
  def get(self):
    notes = db.session.execute(db.select(Note.id, Note.title).order_by(Note.updated_at))
    notes = [{"id": id, "title": title} for id, title in notes]
    return notes
  
  def post(self):
    note = Note(user_id=user_id_from_token(request), **parser.parse_args())
    db.session.add(note)
    db.session.commit()
    return note.id, 201
  
# setup API resource routing
api.add_resource(NoteListResource, '/api/notes')