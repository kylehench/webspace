import datetime, random
from flask import request, make_response
from flask_sqlalchemy import SQLAlchemy

from flask_app import app, db
from flask_app.models.quote import Quote, quote_schema

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

# get quote of the day
@app.route('/api/quotes/today')
def get_quote_today():
  count = Quote.query.count()
  id = int(datetime.datetime.now().strftime("%Y%m%d"))%count
  quote = db.session.get(Quote, id)
  return {"quote": quote_schema.dump(quote)}

# get random quote
@app.route('/api/quotes/random')
def get_quote_random():
  count = Quote.query.count()
  id = int(random.random()*count)
  quote = db.session.get(Quote, id)
  return {"quote": quote_schema.dump(quote)}

# get quote by id
@app.route('/api/quotes/<int:id>')
def get_quote_by_id(id):
  quote = db.session.get(Quote, id)
  return {"quote": quote_schema.dump(quote)}