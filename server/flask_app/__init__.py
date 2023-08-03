import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from sqlalchemy.sql import text

app = Flask(__name__)
app.SECRET_KEY = os.environ.get('SECRET_KEY')

# database configuration and engine creation
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.environ.get('DATABASE_USER')}:{os.environ.get('DATABASE_PASSWORD')}@localhost/webspace"
# app.config["SQLALCHEMY_ECHO"] = True
db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)

# some quote routes need min and max quote ids
try:
  with app.app_context():
    app.config['quote_id_min'] = db.session.execute(text("SELECT id FROM quote ORDER BY id LIMIT 1")).scalar()
    app.config['quote_id_max'] = db.session.execute(text("SELECT id FROM quote ORDER BY id DESC LIMIT 1")).scalar()
except:
  print('Error querying quote table. Does it exist yet? (ignore if before database upgrade)')