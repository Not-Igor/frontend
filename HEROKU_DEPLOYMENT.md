# Frontend Heroku Deployment Guide

## Environment Variables voor Heroku

Stel de volgende environment variable in:

```bash
# Backend API URL - vervang met je backend Heroku URL
heroku config:set REACT_APP_API_URL=https://your-backend-app.herokuapp.com
```

## Deployment Steps

1. **Installeer Heroku Buildpack voor Create React App**
```bash
heroku buildpacks:set mars/create-react-app
```

2. **Deploy**
```bash
git push heroku master
```

3. **Open de app**
```bash
heroku open
```

## Belangrijk

- Vergeet niet om de backend URL in te stellen naar je echte Heroku backend
- De frontend heeft geen gevoelige secrets, maar de API URL moet correct zijn
- CORS moet op de backend correct geconfigureerd zijn om deze frontend URL toe te staan

## Setup .env lokaal

Kopieer `.env.example` naar `.env` voor lokale development:

```bash
cp .env.example .env
```

Dan pas je de waarden aan voor je lokale setup.
