const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Database connection
const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      contact_person TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      category_id INTEGER,
      supplier_id INTEGER,
      min_stock INTEGER DEFAULT 0,
      max_stock INTEGER DEFAULT 1000,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories (id),
      FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
    )`,
    `CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      location TEXT DEFAULT 'Main Warehouse',
      last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id),
      UNIQUE(product_id, location)
    )`,
    `CREATE TABLE IF NOT EXISTS stock_movements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      movement_type TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      reference TEXT,
      notes TEXT,
      location TEXT DEFAULT 'Main Warehouse',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products (id)
    )`
  ];

  // Create tables sequentially to ensure proper order
  let tableIndex = 0;
  function createNextTable() {
    if (tableIndex < tables.length) {
      db.run(tables[tableIndex], (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log(`Table ${tableIndex + 1}/${tables.length} created successfully`);
        }
        tableIndex++;
        createNextTable();
      });
    } else {
      console.log('All tables created successfully');
      // Insert sample data only in development
      if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode: inserting sample data');
        insertSampleData();
      } else {
        console.log('Production mode: skipping sample data insertion');
      }
    }
  }
  
  createNextTable();
}

function insertSampleData() {
  // Wait a bit to ensure tables are created
  setTimeout(() => {
    // Sample categories
    const categories = [
      ['Electronics', 'Electronic devices and components'],
      ['Office Supplies', 'General office supplies and stationery'],
      ['Tools', 'Hardware tools and equipment']
    ];

    categories.forEach(([name, description]) => {
      db.run('INSERT OR IGNORE INTO categories (name, description) VALUES (?, ?)', [name, description], (err) => {
        if (err) console.log('Category insert error:', err.message);
      });
    });

    // Sample suppliers
    const suppliers = [
      ['TechCorp', 'John Smith', 'john@techcorp.com', '555-0101', '123 Tech St'],
      ['Office Plus', 'Jane Doe', 'jane@officeplus.com', '555-0102', '456 Supply Ave']
    ];

    suppliers.forEach(([name, contact, email, phone, address]) => {
      db.run('INSERT OR IGNORE INTO suppliers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)', 
             [name, contact, email, phone, address], (err) => {
        if (err) console.log('Supplier insert error:', err.message);
      });
    });

    // Sample products with images
    setTimeout(() => {
      const sampleProducts = [
        ['LAPTOP001', 'MacBook Pro 14"', 'Apple MacBook Pro with M2 chip', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop', 1, 1, 5, 50],
        ['MOUSE001', 'Wireless Mouse', 'Ergonomic wireless mouse with USB receiver', 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop', 1, 1, 10, 100],
        ['PEN001', 'Blue Ballpoint Pen', 'Smooth writing ballpoint pen', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop', 2, 2, 50, 500],
        ['DRILL001', 'Cordless Drill', 'Professional cordless drill with battery', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=400&fit=crop', 3, 1, 3, 25]
      ];

      sampleProducts.forEach(([sku, name, description, image_url, category_id, supplier_id, min_stock, max_stock]) => {
        db.run('INSERT OR IGNORE INTO products (sku, name, description, image_url, category_id, supplier_id, min_stock, max_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
               [sku, name, description, image_url, category_id, supplier_id, min_stock, max_stock], function(err) {
          if (err) {
            console.log('Product insert error:', err.message);
          } else if (this.lastID) {
            // Add some initial inventory
            const initialStock = Math.floor(Math.random() * 20) + 5;
            db.run('INSERT OR IGNORE INTO inventory (product_id, quantity) VALUES (?, ?)', [this.lastID, initialStock]);
            
            // Add a sample stock movement
            db.run('INSERT INTO stock_movements (product_id, movement_type, quantity, reference, notes) VALUES (?, ?, ?, ?, ?)',
                   [this.lastID, 'IN', initialStock, 'INITIAL', 'Initial stock entry']);
          }
        });
      });
    }, 200);
  }, 100);
}

// API Routes

// Products
app.get('/api/products', (req, res) => {
  const sql = `
    SELECT p.*, c.name as category_name, s.name as supplier_name, 
           COALESCE(i.quantity, 0) as stock_quantity
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN suppliers s ON p.supplier_id = s.id
    LEFT JOIN inventory i ON p.id = i.product_id AND i.location = 'Main Warehouse'
    ORDER BY p.name
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/products', (req, res) => {
  const { sku, name, description, image_url, category_id, supplier_id, min_stock, max_stock } = req.body;
  
  const sql = `INSERT INTO products (sku, name, description, image_url, category_id, supplier_id, min_stock, max_stock) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [sku, name, description, image_url, category_id, supplier_id, min_stock, max_stock], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      // Initialize inventory record
      db.run('INSERT INTO inventory (product_id, quantity) VALUES (?, 0)', [this.lastID]);
      res.json({ id: this.lastID, message: 'Product created successfully' });
    }
  });
});

// Stock movements
app.post('/api/stock/adjust', (req, res) => {
  const { product_id, quantity, movement_type, reference, notes } = req.body;
  
  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    // Record the movement
    db.run(`INSERT INTO stock_movements (product_id, movement_type, quantity, reference, notes) 
            VALUES (?, ?, ?, ?, ?)`, 
           [product_id, movement_type, quantity, reference, notes]);
    
    // Update inventory
    const adjustment = movement_type === 'IN' ? quantity : -quantity;
    db.run(`INSERT OR REPLACE INTO inventory (product_id, quantity, last_updated) 
            VALUES (?, COALESCE((SELECT quantity FROM inventory WHERE product_id = ?), 0) + ?, CURRENT_TIMESTAMP)`,
           [product_id, product_id, adjustment], function(err) {
      if (err) {
        db.run('ROLLBACK');
        res.status(400).json({ error: err.message });
      } else {
        db.run('COMMIT');
        res.json({ message: 'Stock adjusted successfully' });
      }
    });
  });
});

// Categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  db.run('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, message: 'Category created successfully' });
    }
  });
});

// Suppliers
app.get('/api/suppliers', (req, res) => {
  db.all('SELECT * FROM suppliers ORDER BY name', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

app.post('/api/suppliers', (req, res) => {
  const { name, contact_person, email, phone, address } = req.body;
  db.run('INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES (?, ?, ?, ?, ?)', 
         [name, contact_person, email, phone, address], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, message: 'Supplier created successfully' });
    }
  });
});

// Dashboard stats
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};
  
  db.serialize(() => {
    db.get('SELECT COUNT(*) as total FROM products', [], (err, row) => {
      stats.totalProducts = row ? row.total : 0;
    });
    
    db.get('SELECT COUNT(*) as low FROM products p JOIN inventory i ON p.id = i.product_id WHERE i.quantity <= p.min_stock', [], (err, row) => {
      stats.lowStockItems = row ? row.low : 0;
    });
    
    db.get('SELECT SUM(i.quantity) as totalItems FROM inventory i', [], (err, row) => {
      stats.totalItems = row ? (row.totalItems || 0) : 0;
      res.json(stats);
    });
  });
});

// Stock movements history
app.get('/api/movements', (req, res) => {
  const sql = `
    SELECT sm.*, p.name as product_name, p.sku
    FROM stock_movements sm
    JOIN products p ON sm.product_id = p.id
    ORDER BY sm.created_at DESC
    LIMIT 50
  `;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Bulk import products
app.post('/api/products/bulk', (req, res) => {
  const { products } = req.body;
  
  if (!Array.isArray(products)) {
    return res.status(400).json({ error: 'Products must be an array' });
  }

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    
    products.forEach((product, index) => {
      const { sku, name, description, image_url, category_id, supplier_id, unit_price, cost_price, min_stock, max_stock, initial_stock } = product;
      
      const sql = `INSERT INTO products (sku, name, description, image_url, category_id, supplier_id, unit_price, cost_price, min_stock, max_stock) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      db.run(sql, [sku, name, description, image_url, category_id, supplier_id, unit_price, cost_price, min_stock || 5, max_stock || 1000], function(err) {
        if (err) {
          errorCount++;
          errors.push({ index, sku, error: err.message });
        } else {
          successCount++;
          // Initialize inventory record
          const stockQuantity = initial_stock || 0;
          db.run('INSERT INTO inventory (product_id, quantity) VALUES (?, ?)', [this.lastID, stockQuantity]);
          
          // Add initial stock movement if there's stock
          if (stockQuantity > 0) {
            db.run('INSERT INTO stock_movements (product_id, movement_type, quantity, reference, notes) VALUES (?, ?, ?, ?, ?)',
                   [this.lastID, 'IN', stockQuantity, 'BULK_IMPORT', 'Bulk import initial stock']);
          }
        }
        
        // Check if this is the last product
        if (index === products.length - 1) {
          if (errorCount === 0) {
            db.run('COMMIT', (err) => {
              if (err) {
                res.status(500).json({ error: 'Failed to commit transaction' });
              } else {
                res.json({ 
                  message: `Successfully imported ${successCount} products`,
                  successCount,
                  errorCount,
                  errors
                });
              }
            });
          } else {
            db.run('ROLLBACK');
            res.status(400).json({ 
              message: `Import completed with errors. ${successCount} successful, ${errorCount} failed`,
              successCount,
              errorCount,
              errors
            });
          }
        }
      });
    });
  });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Inventory Tracker running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});