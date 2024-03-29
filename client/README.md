# React Client

## Client Deployment (update)
Navigate to `/webspace/client` and build app:
```
git pull
npm run build
```
Replace previous build and restart Nginx:
```
sudo rm -rf /var/www/webspace
sudo mv dist /var/www/webspace
sudo service nginx restart
```
## Client Deployment (update, shell script)
Navigate to `/webspace/client`. Set `BUILD_DESTINATION` .env variable (ex. `/var/www/webspace`).
Grant `build-and-deploy.sh` executable permission. Run:
```
./build-and-deploy.sh
```
## Configure nginx
```
sudo vim /etc/nginx/sites-available/default
```
Example location block:
```
location /webspace {
  alias /var/www/webspace;
  try_files $uri $uri/ /webspace/index.html;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```

## Attributions
Green-leafed plants photo by <a href="https://unsplash.com/@anniespratt?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Annie Spratt</a> on <a href="https://unsplash.com/photos/vWFIbUrcK8s?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>.  
Green grass photo by <a href="https://unsplash.com/@chiklad?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Ochir-Erdene Oyunmedeg</a> on <a href="https://unsplash.com/photos/LmyPLbbUWhA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>.  
Ocean photo by <a href="https://unsplash.com/@kryszpin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Andrzej Kryszpiniuk</a> on <a href="https://unsplash.com/wallpapers/nature/ocean?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>.  
Weather icons from <a href="https://github.com/erikflowers/weather-icons">erikflowers/weather-icons</a>.