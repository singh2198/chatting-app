# Vercel Deployment Guide

## Backend Deployment

### 1. Environment Variables (Backend)
Set these environment variables in your Vercel backend project:

```
PORT=3032
VERCAL_UI_URL=https://your-frontend-url.vercel.app
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
```

### 2. Backend Configuration
- ✅ Fixed port configuration to use `process.env.PORT`
- ✅ Fixed CORS to use environment variable for frontend URL
- ✅ Fixed JWT token generation and verification
- ✅ Fixed MongoDB connection string variable name

## Frontend Deployment

### 1. Environment Variables (Frontend)
Set this environment variable in your Vercel frontend project:

```
REACT_APP_BACKEND_URL=https://your-backend-url.vercel.app
```

### 2. Frontend Configuration
- ✅ Fixed all hardcoded localhost URLs
- ✅ Updated environment variable names to use `REACT_APP_BACKEND_URL`
- ✅ Added fallback to localhost for development

## Deployment Steps

### Backend Deployment
1. Push your backend code to GitHub
2. Connect your backend repository to Vercel
3. Set the environment variables listed above
4. Deploy

### Frontend Deployment
1. Push your frontend code to GitHub
2. Connect your frontend repository to Vercel
3. Set the `REACT_APP_BACKEND_URL` environment variable to your backend URL
4. Deploy

## Important Notes

1. **Environment Variables**: Make sure to set all required environment variables in Vercel dashboard
2. **CORS**: The backend is configured to accept requests from your frontend URL
3. **Socket.IO**: WebSocket connections should work automatically with the correct backend URL
4. **MongoDB**: Ensure your MongoDB Atlas cluster is accessible from Vercel

## Testing

After deployment:
1. Test user registration/login
2. Test real-time messaging
3. Test user mapping functionality
4. Test message deletion

## Troubleshooting

- If you get CORS errors, check that `VERCAL_UI_URL` is set correctly
- If database connection fails, verify `MONGODB_URI` is correct
- If authentication fails, check `JWT_SECRET` is set
- If frontend can't connect to backend, verify `REACT_APP_BACKEND_URL` is correct 