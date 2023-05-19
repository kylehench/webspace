import datetime, random
from flask import request, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import text

from flask_app import app, db
from flask_app.models.quote import Quote, quote_schema

# get quote id min and max
@app.before_first_request
def fetch_variable():
  app.config['quote_id_min'] = db.session.execute(text("SELECT id FROM quote ORDER BY id LIMIT 1")).scalar()
  app.config['quote_id_max'] = db.session.execute(text("SELECT id FROM quote ORDER BY id DESC LIMIT 1")).scalar()

# get quote of the day
@app.route('/api/quotes/today')
def get_quote_today():
  id = int(datetime.datetime.now().strftime("%Y%m%d")) % app.config['quote_id_max'] + app.config['quote_id_min']
  quote = db.session.get(Quote, id)
  return {"quote": quote_schema.dump(quote)}

# get random quote
@app.route('/api/quotes/random')
def get_quote_random():
  id = random.randint(app.config['quote_id_min'], app.config['quote_id_max'])
  quote = db.session.get(Quote, id)
  return {"quote": quote_schema.dump(quote)}

# get quote by id
@app.route('/api/quotes/<int:id>')
def get_quote_by_id(id):
  quote = db.session.get(Quote, id)
  return {"quote": quote_schema.dump(quote)}

# post an array of quotes. JSON:
# {quotes: [{quote1}, {quote2}, ... ]}
@app.route('/api/quotes/', methods=['POST'])
def post_quotes():
  if request.json.get('secret_key') != app.SECRET_KEY:
    return 'Please provide secret_key.'
  quotes = request.json.get('quotes')
  for quote in quotes:
    db.session.add(Quote(text=quote['text'], author=quote['author']))
  db.session.commit()
  return 'success'

# get all quotes
@app.route('/api/quotes/')
def get_quotes():
  if request.json.get('secret_key') != app.SECRET_KEY:
    return 'Please provide secret_key.'
  quotes = db.session.execute(db.select(Quote)).scalars()
  quotes_array = []
  for quote in quotes:
    quotes_array.append(quote_schema.dump(quote))
  return {"quotes": quotes_array}