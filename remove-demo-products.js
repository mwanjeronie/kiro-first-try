const sqlite3 = require('sqlite3').verbose();

// Connect to database
const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to database');
        removeDemoProducts();
    }
});

function removeDemoProducts() {
    // The demo products have SKUs like LAPTOP001, MOUSE001, PEN001, DRILL001
    const demoSKUs = ['LAPTOP001', 'MOUSE001', 'PEN001', 'DRILL001'];

    console.log('Removing demo products...');

    // First, get the product IDs
    const placeholders = demoSKUs.map(() => '?').join(',');
    const selectSQL = `SELECT id, sku, name FROM products WHERE sku IN (${placeholders})`;

    db.all(selectSQL, demoSKUs, (err, rows) => {
        if (err) {
            console.error('Error finding demo products:', err.message);
            return;
        }

        if (rows.length === 0) {
            console.log('No demo products found to remove');
            db.close();
            return;
        }

        console.log(`Found ${rows.length} demo products to remove:`);
        rows.forEach(row => {
            console.log(`- ${row.name} (${row.sku})`);
        });

        const productIds = rows.map(row => row.id);
        const idPlaceholders = productIds.map(() => '?').join(',');

        // Remove in order: stock_movements, inventory, then products
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');

            // Remove stock movements
            db.run(`DELETE FROM stock_movements WHERE product_id IN (${idPlaceholders})`, productIds, (err) => {
                if (err) console.error('Error removing stock movements:', err.message);
                else console.log('✓ Removed stock movements');
            });

            // Remove inventory records
            db.run(`DELETE FROM inventory WHERE product_id IN (${idPlaceholders})`, productIds, (err) => {
                if (err) console.error('Error removing inventory:', err.message);
                else console.log('✓ Removed inventory records');
            });

            // Remove products
            db.run(`DELETE FROM products WHERE id IN (${idPlaceholders})`, productIds, (err) => {
                if (err) {
                    console.error('Error removing products:', err.message);
                    db.run('ROLLBACK');
                } else {
                    console.log('✓ Removed demo products');
                    db.run('COMMIT');
                    console.log('\n🎉 Demo products successfully removed!');
                }

                db.close((err) => {
                    if (err) console.error('Error closing database:', err.message);
                    else console.log('Database connection closed');
                });
            });
        });
    });
}