const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to database');
        checkDemoData();
    }
});

function checkDemoData() {
    console.log('\n=== CHECKING REMAINING DEMO DATA ===\n');
    
    // Check categories
    db.all('SELECT * FROM categories', [], (err, rows) => {
        if (err) {
            console.error('Error checking categories:', err.message);
        } else {
            console.log('Categories:');
            if (rows.length === 0) {
                console.log('  (none)');
            } else {
                rows.forEach(row => {
                    console.log(`  - ${row.name}: ${row.description}`);
                });
            }
        }
        
        // Check suppliers
        db.all('SELECT * FROM suppliers', [], (err, rows) => {
            if (err) {
                console.error('Error checking suppliers:', err.message);
            } else {
                console.log('\nSuppliers:');
                if (rows.length === 0) {
                    console.log('  (none)');
                } else {
                    rows.forEach(row => {
                        console.log(`  - ${row.name} (${row.contact_person})`);
                    });
                }
            }
            
            // Check products
            db.all('SELECT * FROM products', [], (err, rows) => {
                if (err) {
                    console.error('Error checking products:', err.message);
                } else {
                    console.log('\nProducts:');
                    if (rows.length === 0) {
                        console.log('  (none)');
                    } else {
                        rows.forEach(row => {
                            console.log(`  - ${row.name} (${row.sku})`);
                        });
                    }
                }
                
                console.log('\n=== DEMO DATA CHECK COMPLETE ===\n');
                db.close();
            });
        });
    });
}