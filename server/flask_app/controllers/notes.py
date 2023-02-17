from flask_app import app, db
from flask_app.models.note import Note

@app.route('/api/notes', methods=['PUT'])
def create_note():

  # u = User(name='john', email='john@example.com')
  # db.session.add(u)
  # db.session.commit()
  
  return 'hello'