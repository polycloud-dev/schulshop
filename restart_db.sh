docker-compose stop database
docker-compose up -d --no-deps --build database
sh attach.sh