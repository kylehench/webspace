#!/bin/bash

# build app
npm run build

# load .env variables
source .env

# if build source and destination directories exist, delete destination, move source, and restart nginx
# note: dist will only be present if 'npm run build' is successful
if [ -d dist ] && [ -d "$BUILD_DESTINATION" ]; then
  sudo rm -rf "$BUILD_DESTINATION"
  sudo mv dist "$BUILD_DESTINATION"
  sudo service nginx restart
  echo "Build successfully deployed!"
else
  echo "Build or destination directory missing. Check .env variables."
fi