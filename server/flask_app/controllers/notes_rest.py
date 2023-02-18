from flask_app import app, db
from flask_restful import reqparse, abort, Api, Resource
from flask_app.models.note import Note, NoteSchema

api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('title')
parser.add_argument('content')

class NoteList(Resource):
  def get(self):
    return ''
  
  def post(self):
    note = Note(user_id=1, **parser.parse_args())
    db.session.add(note)
    db.session.commit()
    return note.id, 201
  
# setup API resource routing
api.add_resource(NoteList, '/notes')