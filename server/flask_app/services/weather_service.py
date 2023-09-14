from flask_app.services import weather_adapter
from flask_app.models.cached_resource import CachedResource, CachedResourceRepository

api = weather_adapter.WeatherAdapter(source='meteomatics')
cache_repository = CachedResourceRepository(
  resource_name='daily_forcast',
  expiration_hours=1
)

def get_weather(request_args):
  # check cached for weather
  res = cache_repository.get(request_args)
  if res:
    return res

  res = {}
  try:
    res = api.daily_forcast(**request_args)
    cache_repository.set(request_args, res)
  except:
    raise ConnectionError
  return res