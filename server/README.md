# webspace server

### Update Database
After a change in any models, activate pipenv shell (```pipenv shell``` or ```source venv/bin/activate```) and run:
```
flask db migrate
```
Review changes in migrations/versions, then upgrade:
```
flask db upgrade
```

## Deployment
### Instructions for deployment on a Linux server with Node, PM2, Python, MySQL, and Nginx installed. Pyenv recommended.
Clone project from GitHub, create virtual environment, and install modules.
```
git clone https://github.com/kylehench/webspace
cd webspace/server
pipenv install
```

Copy .env.example, edit variables in nano or vim:
```
cp .env.example .env
vim .env
```

In MySQL shell, create database:
```
CREATE DATABASE webspace;
```

Upgrade database (creates and/or updates tables):
```
flask db upgrade
```

Test Server:
```
gunicorn --bind 0.0.0.0:4999 wsgi:application
```

Start app in PM2:
```
pm2 --name=webspaceServer start "cd ~/webspace/server && pipenv run gunicorn --env SCRIPT_NAME=/webspace --bind 0.0.0.0:5002 wsgi:application"
```

Configure nginx:
```
sudo vim /etc/nginx/sites-available/default
```
Example location block:
```
location /webspace/api {
  proxy_pass http://localhost:[PORT]};
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_set_header X-Forwarded-For $remote_addr;
  proxy_cache_bypass $http_upgrade;
}
```