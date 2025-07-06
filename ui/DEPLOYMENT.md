# Vercel Deployment Guide

## Steps to Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the ui directory**:
   ```bash
   cd ui
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `chatting-app-ui` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings: `N`

## Configuration Files Added

### vercel.json
This file tells Vercel how to handle client-side routing by redirecting all requests to `index.html`.

### public/_redirects
Alternative approach for handling client-side routing.

### Updated AppRoutes.jsx
Added proper home route and fallback routing.

## Common Issues and Solutions

1. **404 Errors**: The `vercel.json` file should fix this by handling client-side routing.

2. **Build Errors**: Make sure all dependencies are installed:
   ```bash
   npm install
   ```

3. **Environment Variables**: If you need environment variables, add them in the Vercel dashboard under Project Settings > Environment Variables.

## After Deployment

Your app should now be accessible at the Vercel URL without 404 errors. The routing will work properly for all your routes:
- `/` → redirects to `/authuser`
- `/authuser` → AuthForm component
- `/chat` → App component
- `/Register` → Register component
- Any other route → redirects to `/authuser` 