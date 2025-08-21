const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  
  console.log('Checking database schema...');
  
  db.all("PRAGMA table_info(products)", [], (err, rows) => {
    if (err) {
      console.error('Error getting schema:', err.message);
    } else {
      console.log('Products table columns:');
      rows.forEach(row => {
        console.log(`- ${row.name} (${row.type})`);
      });
    }
    
    db.close();
  });
});