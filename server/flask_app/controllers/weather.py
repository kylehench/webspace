import requests
from flask import request
from flask_app import app
from flask_restful import abort
from datetime import datetime, timezone, timedelta

@app.route('/api/weather/')
def get_weather():
  req_datetime = request.args.get('datetime')
  country_code = request.args.get('countryCode')
  zip_code = request.args.get('zipCode')
  datetime_start = datetime.fromisoformat(req_datetime).replace(tzinfo=timezone.utc)
  datetime_end = datetime_start + timedelta(days=3)
  utc_start = datetime_start.isoformat().replace('+00:00','Z')
  utc_end = datetime_end.isoformat().replace('+00:00','Z')
  weather_url = f"https://api.meteomatics.com/{utc_start}--{utc_end}:P1D/t_max_2m_24h:F,t_min_2m_24h:F,weather_symbol_24h:idx/postal_{country_code}{zip_code}/json?model=mix"

  # json_res = requests.get(f'https://api.meteomatics.com/2023-08-31T00:00:00Z--2023-09-03T00:00:00Z:P1D/t_max_2m_24h:F,t_min_2m_24h:F,weather_symbol_24h:idx/postal_US94087/json?model=mix', auth=(app.config['METEOMATICS_USER'], app.config['METEOMATICS_PASSWORD'])).json()
  # if json_res['status'] != 'OK':
  #   abort(400)
  # return {'data': json_res['data'], 'dateGenerated': json_res['dateGenerated']}


  mock_res = {'data': [{'coordinates': [{'dates': [{'date': '2023-08-31T00:00:00Z', 'value': 95.5}, {'date': '2023-09-01T00:00:00Z', 'value': 93.2}, {'date': '2023-09-02T00:00:00Z', 'value': 80.7}, {'date': '2023-09-03T00:00:00Z', 'value': 77.3}], 'station_id': 'postal_US94087'}], 'parameter': 't_max_2m_24h:F'}, {'coordinates': [{'dates': [{'date': '2023-08-31T00:00:00Z', 'value': 67.1}, {'date': '2023-09-01T00:00:00Z', 'value': 59.5}, {'date': '2023-09-02T00:00:00Z', 'value': 60.7}, {'date': '2023-09-03T00:00:00Z', 'value': 55.9}], 'station_id': 'postal_US94087'}], 'parameter': 't_min_2m_24h:F'}, {'coordinates': [{'dates': [{'date': '2023-08-31T00:00:00Z', 'value': 1}, {'date': '2023-09-01T00:00:00Z', 'value': 1}, {'date': '2023-09-02T00:00:00Z', 'value': 3}, {'date': '2023-09-03T00:00:00Z', 'value': 8}], 'station_id': 'postal_US94087'}], 'parameter': 'weather_symbol_24h:idx'}], 'dateGenerated': '2023-09-01T06:53:53Z'}
  return mock_res