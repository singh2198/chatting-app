# Chatting App Backend

## Environment Variables Required

For the backend to work properly, you need to set the following environment variables in your Vercel deployment:

### Required Variables:
- `MONGO_URI`: Your MongoDB connection string
- `JWT_TOKEN`: A secret key for JWT token generation and verification

### Optional Variables:
- `FRONTEND_URL`: Your frontend URL (defaults to the current frontend URL)
- `PORT`: Port number (defaults to 5000)

## Deployment Issues Fixed

1. **Port Configuration**: Fixed the incorrect port assignment from `BACKEND_URL` to proper `PORT` environment variable
2. **CORS Configuration**: Made CORS more flexible to work with different frontend URLs
3. **JWT Token Consistency**: Fixed the inconsistency between token signing and verification
4. **Added Test Route**: Added a basic `/` route to verify the server is running

## Testing the Backend

After deployment, you can test if the backend is working by visiting:
`https://your-backend-url.vercel.app/`

You should see: `{"message": "Chatting App Backend is running!"}`

## API Endpoints

- `GET /` - Test endpoint
- `POST /Register` - Register a new user
- `POST /singup` - Sign up a new user
- `POST /login` - User login
- `POST /addUserToMap` - Add user to chat map
- `GET /getsingupuser` - Get all signup users
- `POST /getmappedusers` - Get mapped users
- `GET /getusers` - Get all users
- `POST /sendMessage` - Send a message
- `GET /getmessage` - Get messages between users
- `PUT /deletemessage` - Delete a message
- `GET /profile` - Get user profile (protected route) 