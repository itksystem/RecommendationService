docker pull itksystem/recommendation-service
docker run -d --name recommendation-service --restart unless-stopped -p 3008:3008 -p 5672:5672 -p 443:443 --env-file .env.prod itksystem/recommendation-service


