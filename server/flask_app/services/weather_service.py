from flask_app.services import weather_adapter
from flask_app.models.cached_resource import CachedResourceRepository

weather_source = 'meteomatics'

weather_api = weather_adapter.WeatherAdapter(source=weather_source)
weather_cache_repository = CachedResourceRepository(
  resource_name='daily_forcast',
  expiration_hours=1
)

def daily_forcast(day_start, days, country_code, zip_code):
  request_args = {
    'day_start': day_start,
    'days': days,
    'country_code': country_code,
    'zip_code': zip_code
  }
  # check cache for weather
  res = weather_cache_repository.get(request_args)
  if res:
    return res

  res = {}
  try:
    res = weather_api.daily_forcast(**request_args)
    weather_cache_repository.set(request_args, res)
  except:
    raise ConnectionError(f'Failed to fetch weather from {weather_source}')
  return res