# MongoDB Setup Guide

## Option 1: MongoDB Atlas (Recommended - Free Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a free cluster (M0 - Free tier)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Update `backend/.env` file:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skillnest?retryWrites=true&w=majority
   ```
   Replace `username` and `password` with your Atlas credentials.

## Option 2: Local MongoDB Installation

### Windows:
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service (usually starts automatically)
4. Your `.env` should have:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/skillnestDB
   ```

### Quick Test:
```bash
# Check if MongoDB is running
mongosh
# or
mongo
```

## Current Configuration

Your `.env` file should contain:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skillnestDB
JWT_SECRET=dev_secret_key_change_me
```

For MongoDB Atlas, replace MONGO_URI with your Atlas connection string.

> Tip: the backend now falls back to the URI and secret above if you forget to create a `.env` file, so local development works out of the box. Make sure to override both values in production.

