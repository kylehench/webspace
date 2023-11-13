from flask_app import app
import requests
from datetime import datetime, timezone, timedelta
from ratelimit import limits

class MeteomaticsAPI:
  def __init__(self):
    if 'METEOMATICS_USER' not in app.config or 'METEOMATICS_PASSWORD' not in app.config:
      raise KeyError('Missing Meteomatics API username and/or password: set METEOMATICS_USER and METEOMATICS_PASSWORD .env variables')

    self.user = app.config['METEOMATICS_USER']
    self.password = app.config['METEOMATICS_PASSWORD']

  @limits(calls=50, period=60)
  @limits(calls=500, period=24*3600)
  def daily_forcast(self, day_start, days, country_code, zip_code):
    # note: one day added to datetime_start because 't_max_2m_24h' and 't_min_2m_24h' return values from 24h in past: https://www.meteomatics.com/en/api/available-parameters/
    datetime_start = datetime.fromisoformat(day_start).replace(tzinfo=timezone.utc) + timedelta(days=1)
    # extra day included because daily low comes from next day's morning
    datetime_end = datetime_start + timedelta(days=days)
    utc_start = datetime_start.isoformat().replace('+00:00','Z')
    utc_end = datetime_end.isoformat().replace('+00:00','Z')
    weather_url = f"https://api.meteomatics.com/{utc_start}--{utc_end}:P1D/t_max_2m_24h:F,t_min_2m_24h:F,weather_symbol_24h:idx/postal_{country_code}{zip_code}/json?model=mix"
    
    json_res = requests.get(weather_url, auth=(self.user, self.password)).json()
    
    if json_res['status'] != 'OK':
      raise ConnectionError

    parameters = {parameter['parameter']: parameter['coordinates'][0]['dates'] for parameter in json_res['data']}

    daily_forcast = {
      'highs': [date['value'] for date in parameters['t_max_2m_24h:F']],
      'lows': [date['value'] for date in parameters['t_min_2m_24h:F']],
      'weather_symbol': [date['value'] for date in parameters['weather_symbol_24h:idx']],
      'source': 'meteomatics'
    }
    
    return daily_forcast


class WeatherAdapter:
  def __init__(self, source):
    match source.lower():
      case 'meteomatics':
        self.api = MeteomaticsAPI()
      case other:
        raise ValueError('Please specify a valid API source')
    
  def daily_forcast(self, **kwargs):
    return self.api.daily_forcast(**kwargs)