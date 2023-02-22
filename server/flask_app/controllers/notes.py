from flask_app import app, db
from flask_app.models.note import Note, NoteSchema
from flask import request
# from login_required_dec import login_required_dec
from flask_app.services.authorization import user_id_from_token

@app.route('/api/test1', methods=['POST'])
# @login_required_dec
def create_note():

  note = Note(title='To Do', content='Go to the grocery store')
  db.session.add(note)
  db.session.commit()

  note = Note.query.first()
  note_schema = NoteSchema()
  output = note_schema.dump(note)
  print(output)
  
  return {'note': output}

@app.route('/api/test2')
def test2():
  print(request.cookies.get('usertoken'))
  user_id = user_id_from_token(request)
  print(user_id)
  return f'{user_id}'