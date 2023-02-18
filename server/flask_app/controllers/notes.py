from flask_app import app, db
from flask_app.models.note import Note, NoteSchema
# from login_required_dec import login_required_dec

@app.route('/api/notes', methods=['GET'])
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