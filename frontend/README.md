# Car Racing Tracker Frontend

Frontend for the Car Racing Tracker application, designed to be hosted on GitHub Pages.

## Features

- Landing page with "Start Game" button
- Collects user data including:
  - IP address (via backend)
  - Timestamp
  - Screen size
  - Device/browser details (User-Agent)
  - Geolocation (precise GPS if permitted)
- Redirects to a simple HTML5 car racing game

## Project Structure

```
/frontend
├── index.html         ← Start page + logging trigger
├── game.html          ← Car racing game
├── css/
│   └── style.css      ← Styles for both pages
└── js/
    ├── config.js      ← API configuration
    ├── main.js        ← Landing page logic
    └── game.js        ← Game implementation
```

## Setup for GitHub Pages

1. Fork or clone this repository
2. Update the `API_URL` in `js/config.js` to point to your Railway.app backend
3. Push the code to a GitHub repository
4. Enable GitHub Pages in the repository settings:
   - Go to Settings > Pages
   - Select the branch you want to deploy (usually `main`)
   - Save the settings

## Local Development

To test locally, you can use any simple HTTP server:

```bash
# Using Python
python -m http.server

# Using Node.js
npx serve
```

## Important Notes

- The application requires HTTPS to use the Geolocation API
- GitHub Pages automatically provides HTTPS
- Make sure your backend URL in `config.js` is also using HTTPS
