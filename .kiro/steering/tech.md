# Technology Stack

## Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3 with sqlite3 npm package
- **Authentication**: JWT tokens with bcryptjs for password hashing
- **File Uploads**: Multer middleware
- **CORS**: cors middleware for cross-origin requests

## Frontend
- **Architecture**: Vanilla JavaScript SPA
- **Styling**: Custom CSS with mobile-first responsive design
- **API Communication**: Fetch API for REST endpoints

## Development Tools
- **Process Manager**: nodemon for development auto-restart
- **Package Manager**: npm

## Common Commands

### Development
```bash
npm run dev          # Start with nodemon (auto-restart)
npm start           # Production start
npm install         # Install dependencies
```

### Database
- SQLite database auto-initializes on first run
- Sample data inserted automatically
- Database file: `inventory.db`

## Architecture Patterns
- RESTful API design
- Database transactions for stock movements
- Graceful error handling with proper HTTP status codes
- Mobile-first responsive design principles