import os
from dotenv import load_dotenv
load_dotenv()

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate

app = Flask(__name__)
app.SECRET_KEY = os.environ.get('SECRET_KEY')

# database configuration and engine creation
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.environ.get('DATABASE_USER')}:{os.environ.get('DATABASE_PASSWORD')}@localhost/webspace"
db = SQLAlchemy(app)
ma = Marshmallow(app)
migrate = Migrate(app, db)