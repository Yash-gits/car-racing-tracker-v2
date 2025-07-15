# Car Racing Tracker Backend

Backend API for the Car Racing Tracker application.

## Features

- API endpoints for logging user data
- MongoDB integration for data storage
- CORS configuration for frontend integration
- IP-based geolocation

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

- `GET /`: API status check
- `POST /api/log`: Log basic user data
- `POST /api/log-location`: Log precise location data
- `GET /api/logs`: Get all basic logs (admin only)
- `GET /api/locations`: Get all location logs (admin only)

## Deployment on Railway.app

1. Create a new project on Railway.app
2. Connect your GitHub repository
3. Add the MongoDB plugin or provide your own MongoDB connection string
4. Set the required environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: Your GitHub Pages URL
5. Deploy the application

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `FRONTEND_URL`: Frontend URL for CORS configuration
- `PORT`: Port for the server (default: 3000)
