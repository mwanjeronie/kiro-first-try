# Inventory Tracker

A comprehensive, mobile-friendly inventory tracking web application built with Node.js and SQLite.

## Features

### 📱 Mobile-First Design
- Responsive layout that works perfectly on phones, tablets, and desktop
- Touch-friendly interface with large buttons and easy navigation
- Optimized for mobile workflows

### 📦 Product Management
- Add, view, and manage products with SKU, descriptions, and pricing
- Categorize products and assign suppliers
- Set minimum and maximum stock levels
- Real-time stock status indicators

### 📊 Inventory Tracking
- Real-time stock level monitoring
- Stock adjustment with movement history
- Low stock alerts and notifications
- Automatic stock calculations

### 📈 Dashboard & Analytics
- Overview of total products and inventory value
- Low stock item alerts
- Recent stock movement history
- Key performance indicators

### 🏢 Supplier & Category Management
- Manage supplier information and contacts
- Organize products by categories
- Easy supplier and category assignment

### 📋 Stock Movement History
- Complete audit trail of all stock movements
- Track stock in/out with references and notes
- Movement history with timestamps

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

### Development Mode
For development with auto-restart:
```bash
npm run dev
```

## Usage

### Adding Products
1. Click "Add Product" button in the header
2. Fill in product details (SKU and name are required)
3. Optionally assign category and supplier
4. Set pricing and stock levels
5. Click "Add Product"

### Managing Stock
1. Go to the "Stock" section
2. Click "Adjust Stock" or use the adjust button on any product
3. Select the product and movement type (Stock In/Out)
4. Enter quantity and optional reference/notes
5. Submit the adjustment

### Categories & Suppliers
1. Go to "Settings" section
2. Add categories to organize your products
3. Add suppliers with contact information
4. Assign them when creating products

### Dashboard Overview
- View total products and inventory value
- Monitor low stock items that need attention
- Check recent stock movements
- Get quick insights into your inventory health

## Database

The application uses SQLite for data storage with the following main tables:
- **products**: Product information and details
- **categories**: Product categories
- **suppliers**: Supplier information
- **inventory**: Current stock levels
- **stock_movements**: Complete movement history

The database file (`inventory.db`) is created automatically when you first run the application.

## API Endpoints

### Products
- `GET /api/products` - Get all products with stock info
- `POST /api/products` - Create new product

### Stock Management
- `POST /api/stock/adjust` - Adjust stock levels

### Categories & Suppliers
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create new supplier

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/movements` - Get stock movement history

## Mobile Features

### Responsive Navigation
- Collapsible navigation for mobile screens
- Icon-based navigation on small screens
- Touch-friendly buttons and controls

### Mobile-Optimized Forms
- Large input fields for easy typing
- Proper keyboard types for different inputs
- Simplified layouts for small screens

### Touch Interactions
- Swipe-friendly tables and lists
- Large tap targets for buttons
- Smooth scrolling and transitions

## Customization

### Styling
Edit `public/styles.css` to customize the appearance:
- Color scheme variables at the top
- Mobile breakpoints for responsive design
- Component-specific styles

### Database Schema
Modify `server.js` to add new fields or tables:
- Update the `initializeDatabase()` function
- Add new API endpoints as needed
- Update the frontend to handle new data

## Production Deployment

### Environment Variables
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Set to 'production' for production mode

### Database Backup
The SQLite database file should be backed up regularly:
```bash
cp inventory.db inventory_backup_$(date +%Y%m%d).db
```

### Security Considerations
- Add authentication for production use
- Implement rate limiting
- Use HTTPS in production
- Regular database backups

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari (iOS and macOS)
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both desktop and mobile
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed  
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No warranty provided
- ❌ No liability assumed

The MIT License is a permissive open source license that allows you to use this software for any purpose, including commercial applications, as long as you include the original copyright notice.

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure Node.js version compatibility
4. Check that port 3000 is available

The application includes comprehensive error handling and user feedback to help identify and resolve issues quickly.