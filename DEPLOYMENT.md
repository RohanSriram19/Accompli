# Accompli Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build settings:
     - Framework: Next.js
     - Root Directory: `apps/web`
     - Build Command: `cd ../.. && npm install && cd apps/web && npm run build`
     - Install Command: `npm install`

3. **Set Environment Variables** in Vercel dashboard:
   - `NEXTAUTH_SECRET`: Generate a random string
   - `OPENAI_API_KEY`: (Optional) Your OpenAI API key
   - `NEXTAUTH_URL`: Your domain (e.g., https://your-app.vercel.app)

### Option 2: Netlify

1. **Push to GitHub** (same as above)
2. **Deploy to Netlify**:
   - Connect your GitHub repo
   - Build settings:
     - Base directory: `apps/web`
     - Build command: `npm run build`
     - Publish directory: `apps/web/.next`

### Option 3: Docker + Any Cloud Provider

1. **Build the Docker image**:
   ```bash
   cd apps/web
   docker build -t accompli-web .
   ```

2. **Test locally**:
   ```bash
   docker run -p 3000:3000 accompli-web
   ```

3. **Deploy to**:
   - **Railway**: Push Docker image
   - **DigitalOcean App Platform**: Connect GitHub repo
   - **AWS ECS/Fargate**: Push to ECR and deploy
   - **Google Cloud Run**: Push to GCR and deploy
   - **Heroku**: Use Container Registry

### Option 4: Static Export (GitHub Pages, etc.)

1. **Update next.config.mjs**:
   ```javascript
   output: 'export',
   trailingSlash: true,
   images: {
     unoptimized: true
   }
   ```

2. **Build and export**:
   ```bash
   cd apps/web
   npm run build
   ```

3. **Deploy the `out` folder** to any static hosting service

## 🔧 Build Commands for Different Platforms

### Vercel
```bash
cd ../.. && npm install && cd apps/web && npm run build
```

### Netlify
```bash
npm run build
```

### Railway/Heroku
```bash
npm run build && npm start
```

## 🌍 Environment Variables

### Required for Production:
- `NEXTAUTH_SECRET`: Random secret key for authentication
- `NEXTAUTH_URL`: Your domain URL

### Optional:
- `OPENAI_API_KEY`: For live AI features (works in demo mode without)
- `NEXT_PUBLIC_API_URL`: Backend API URL (currently not required)

## ✅ Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Domain/URL updated in configs  
- [ ] Build command working locally
- [ ] No API keys exposed in client code
- [ ] Error boundaries implemented
- [ ] Loading states handled
- [ ] Mobile responsiveness tested

## 🎯 Recommended: Vercel Deployment

The easiest path is Vercel since it's optimized for Next.js:

1. Push code to GitHub
2. Import repo in Vercel
3. Set environment variables
4. Deploy!

Your app will be live at `https://your-repo-name.vercel.app`
