# Project Structure

## Root Directory
```
├── server.js              # Main Express server and API routes
├── package.json           # Dependencies and npm scripts
├── inventory.db           # SQLite database (auto-generated)
├── README.md             # Project documentation
└── public/               # Frontend static files
    ├── index.html        # Main HTML page
    ├── app.js           # Frontend JavaScript
    └── styles.css       # CSS styles
```

## Data Scripts
Multiple utility scripts for product management:
- `add-*.js` - Various product import scripts
- `import-products.js` - Main product import utility
- `remove-demo-products.js` - Demo data cleanup
- `check-schema.js` - Database schema validation

## Database Schema
- **products** - Core product information with SKU, pricing, stock limits
- **categories** - Product categorization
- **suppliers** - Supplier contact information  
- **inventory** - Current stock levels by location
- **stock_movements** - Complete audit trail of stock changes

## API Structure
- `/api/products` - Product CRUD operations
- `/api/categories` - Category management
- `/api/suppliers` - Supplier management
- `/api/stock/adjust` - Stock movement transactions
- `/api/dashboard/stats` - Analytics endpoints
- `/api/movements` - Movement history

## Frontend Organization
- Single-page application with vanilla JavaScript
- Mobile-first responsive CSS
- RESTful API integration with fetch()