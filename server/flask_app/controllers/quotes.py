import datetime, random
from flask import request, abort

from flask_app import app, db
from flask_app.models.quote import Quote, quote_schema

# get quote of the day
@app.route('/api/quotes/today')
def get_quote_today():
  id = int(datetime.datetime.now().strftime("%Y%m%d")) % (app.config['quote_id_max']-app.config['quote_id_min']+1) + app.config['quote_id_min']
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
    abort(401)
  quotes = request.json.get('quotes')
  for quote in quotes:
    db.session.add(Quote(text=quote['text'], author=quote['author']))
  db.session.commit()
  return 'success'

# get all quotes
@app.route('/api/quotes/')
def get_quotes():
  if request.json.get('secret_key') != app.SECRET_KEY:
    abort(401)
  quotes = db.session.execute(db.select(Quote)).scalars()
  quotes_array = []
  for quote in quotes:
    quotes_array.append(quote_schema.dump(quote))
  return {"quotes": quotes_array}