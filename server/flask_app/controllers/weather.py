from flask import request
from flask_app import app
import flask_app.services.weather_service as weather_service
from flask_restful import abort

@app.route('/api/weather/')
def daily_forcast():
  request_args = {
    'day_start': request.args.get('dayStart'),
    'days': 4,
    'country_code': request.args.get('countryCode'),
    'zip_code': request.args.get('zipCode')
  }
  try:
    res = weather_service.daily_forcast(request_args)
  except:
    abort(400)

  return res
  
  
  # datetime_start = datetime.fromisoformat(day_start).replace(tzinfo=timezone.utc)
  # datetime_end = datetime_start + timedelta(days=3)
  # utc_start = datetime_start.isoformat().replace('+00:00','Z')
  # utc_end = datetime_end.isoformat().replace('+00:00','Z')
  # weather_url = f"https://api.meteomatics.com/{utc_start}--{utc_end}:P1D/t_max_2m_24h:F,t_min_2m_24h:F,weather_symbol_24h:idx/postal_{country_code}{zip_code}/json?model=mix"

  # json_res = requests.get(f'https://api.meteomatics.com/2023-08-31T00:00:00Z--2023-09-03T00:00:00Z:P1D/t_max_2m_24h:F,t_min_2m_24h:F,weather_symbol_24h:idx/postal_US94087/json?model=mix', auth=(app.config['METEOMATICS_USER'], app.config['METEOMATICS_PASSWORD'])).json()
  # if json_res['status'] != 'OK':
  #   abort(400)
  # return {'data': json_res['data'], 'dateGenerated': json_res['dateGenerated']}