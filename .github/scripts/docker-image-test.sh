#!/bin/bash

# exit on error
set -e

# copy webapp settings
cp public/webapp-settings.example.json webapp-settings.local.json

# start server
docker-compose up -d

# test if the server is running and serves files
requested_settings=$(curl http://localhost:5000/webapp-settings.json)

# compare served file with actual file (a 404 or 50x error - or a timeout - would fail here)
actual_settings=$(cat webapp-settings.local.json)
if [ "$actual_settings" != "$requested_settings" ]; then
  echo "Could not verify server functionality. Received settings:"
  echo "$requested_settings"
  exit 1
fi

echo "Received settings:"
echo "$requested_settings"

# test if homepage gets served without errors
requested_homepage=$(curl http://localhost:5000/)
echo "Received homepage:"
echo "$requested_homepage"

echo "Server seems to respond correctly."

# shutdown server
docker-compose down

# cleanup
rm webapp-settings.local.json

exit 0
