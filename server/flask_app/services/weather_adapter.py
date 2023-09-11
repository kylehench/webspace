from flask_app import app
import requests
from datetime import datetime, timezone, timedelta

class MeteomaticsAPI:
  def __init__(self):
    self.user = app.config['METEOMATICS_USER']
    self.password = app.config['METEOMATICS_PASSWORD']
    if not self.user or self.password:
      raise KeyError('Missing Meteomatics API username or password')

  def daily_forcast(self, day_start, days, country_code, zip_code):
    datetime_start = datetime.fromisoformat(day_start).replace(tzinfo=timezone.utc)
    datetime_end = datetime_start + timedelta(days=days)
    utc_start = datetime_start.isoformat().replace('+00:00','Z')
    utc_end = datetime_end.isoformat().replace('+00:00','Z')
    weather_url = f"https://api.meteomatics.com/{utc_start}--{utc_end}:P1D/t_max_2m_24h:F,t_min_2m_24h:F,weather_symbol_24h:idx/postal_{country_code}{zip_code}/json?model=mix"

    json_res = requests.get(weather_url, auth=(self.user, self.password)).json()
    if json_res['status'] != 'OK':
      raise ConnectionError
    daily_forcast = []
    return {'daily_forcast': daily_forcast}


class WeatherAdapter:
  def __init__(self, source):
    match source.lower():
      case 'meteomatics':
        self.api = MeteomaticsAPI()
    if not self.api:
      raise ValueError('API source not found')
    
  def daily_forcast(self, *args, **kwargs):

    mock_res = {'data': [{'coordinates': [{'dates': [{'date': '2023-08-31T00:00:00Z', 'value': 95.5}, {'date': '2023-09-01T00:00:00Z', 'value': 93.2}, {'date': '2023-09-02T00:00:00Z', 'value': 80.7}, {'date': '2023-09-03T00:00:00Z', 'value': 77.3}], 'station_id': 'postal_US94087'}], 'parameter': 't_max_2m_24h:F'}, {'coordinates': [{'dates': [{'date': '2023-08-31T00:00:00Z', 'value': 67.1}, {'date': '2023-09-01T00:00:00Z', 'value': 59.5}, {'date': '2023-09-02T00:00:00Z', 'value': 60.7}, {'date': '2023-09-03T00:00:00Z', 'value': 55.9}], 'station_id': 'postal_US94087'}], 'parameter': 't_min_2m_24h:F'}, {'coordinates': [{'dates': [{'date': '2023-08-31T00:00:00Z', 'value': 1}, {'date': '2023-09-01T00:00:00Z', 'value': 1}, {'date': '2023-09-02T00:00:00Z', 'value': 3}, {'date': '2023-09-03T00:00:00Z', 'value': 8}], 'station_id': 'postal_US94087'}], 'parameter': 'weather_symbol_24h:idx'}], 'dateGenerated': '2023-09-01T06:53:53Z'}
    return mock_res
    
    return self.api.daily_forcast(*args, **kwargs)