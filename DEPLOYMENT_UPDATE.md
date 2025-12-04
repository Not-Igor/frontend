# Frontend Deployment Update

## Probleem
De create-react-app buildpack werkt niet meer op de nieuwste Heroku stacks (heroku-22 en heroku-24).

## Oplossingen

### Optie 1: Deploy naar Vercel (AANBEVOLEN)
Vercel is perfect voor React apps en is gratis voor hobby projecten.

```bash
# Installeer Vercel CLI
npm i -g vercel

# Deploy
vercel

# Volg de prompts en kies:
# - Setup and deploy? Yes
# - Which scope? Je account
# - Link to existing project? No
# - What's your project's name? kompapp-frontend
# - In which directory is your code located? ./
# - Want to modify settings? No

# Voor productie deployment
vercel --prod
```

Na deployment, update de backend CORS:
```bash
heroku config:set CORS_ORIGINS="https://jouw-vercel-url.vercel.app,http://localhost:3000" -a kompapp-backend
```

### Optie 2: Deploy naar Netlify
```bash
# Installeer Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod

# Kies:
# - Create a new site
# - Build command: npm run build
# - Publish directory: build
```

###Optie 3: Render.com
1. Ga naar https://render.com
2. Maak een nieuw "Static Site"
3. Connect je GitHub repository
4. Build Command: `npm run build`
5. Publish Directory: `build`
6. Environment Variables:
   - `REACT_APP_API_URL`: `https://kompapp-backend-e3cd8ff5eeb6.herokuapp.com`

### Optie 4: Manual Heroku Deploy met Docker
Als je echt Heroku wilt gebruiken, moet je een custom Docker container maken.

## Huidige Status

✅ **Backend is LIVE**: https://kompapp-backend-e3cd8ff5eeb6.herokuapp.com/
❌ **Frontend**: Moet naar Vercel/Netlify/Render

## Na Frontend Deployment

Vergeet niet om de CORS origins bij te werken op de backend:

```bash
heroku config:set CORS_ORIGINS="https://jouw-frontend-url.com,http://localhost:3000" -a kompapp-backend
```
