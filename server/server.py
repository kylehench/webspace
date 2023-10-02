from flask_app import app
from flask_app.controllers import cached_resource
from flask_app.controllers import notes
from flask_app.controllers import quotes
from flask_app.controllers import weather

if __name__=='__main__':
  app.run(debug=True)