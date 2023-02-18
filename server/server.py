from flask_app import app
from flask_app.controllers import notes
from flask_app.controllers import notes_rest

if __name__=='__main__':
  app.run(debug=True)