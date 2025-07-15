# Car Racing Tracker v2

A web application that logs user data before redirecting to a car racing game. This version is designed for deployment with GitHub Pages (frontend) and Railway.app (backend).

## Project Structure

The project is split into two main components:

```
/car-racing-tracker-v2
├── frontend/         ← Static files for GitHub Pages
│   ├── index.html    ← Landing page
│   ├── game.html     ← Game page
│   ├── css/          ← Stylesheets
│   └── js/           ← JavaScript files
└── backend/          ← Node.js API for Railway.app
    ├── server.js     ← Express server
    └── package.json  ← Dependencies
```

## Features

- Landing page with "Start Game" button
- Collects user data including:
  - IP address
  - Timestamp
  - Screen size
  - Device/browser details (User-Agent)
  - Geolocation (precise GPS if permitted, IP-based fallback)
- Redirects to a simple HTML5 car racing game
- MongoDB integration for data storage
- Responsive design for mobile and desktop

## Deployment Instructions

### Frontend (GitHub Pages)

1. Create a new GitHub repository
2. Push the contents of the `frontend` folder to the repository
3. Enable GitHub Pages in the repository settings:
   - Go to Settings > Pages
   - Select the branch you want to deploy (usually `main`)
   - Save the settings
4. Your site will be available at `https://yourusername.github.io/repository-name`

### Backend (Railway.app)

1. Create a new project on Railway.app
2. Connect your GitHub repository containing the `backend` folder
3. Add the MongoDB plugin or provide your own MongoDB connection string
4. Set the required environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: Your GitHub Pages URL
5. Deploy the application

### Configuration

After deployment, update the `API_URL` in `frontend/js/config.js` to point to your Railway.app backend URL.

## Local Development

### Frontend

```bash
cd frontend
npx serve
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Notes

- This application is intended for temporary use only
- All data is logged to MongoDB
- The application requires HTTPS to use the Geolocation API
- GitHub Pages and Railway.app both provide HTTPS by default
