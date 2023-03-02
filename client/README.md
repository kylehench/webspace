## Development
In VS Code, ```Ctrl + P``` + "```task start app```" will run React scripts and Flask API server in 2 terminals.

## Client Deployment (initial or update)
```
git pull
```
Navigate to client folder. Run:
```
npm run build
sudo rm -rf /var/www/webspace
sudo mv build /var/www/webspace
```

## Attributions
Ocean photo by <a href="https://unsplash.com/@kryszpin?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Andrzej Kryszpiniuk</a> on <a href="https://unsplash.com/wallpapers/nature/ocean?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>.