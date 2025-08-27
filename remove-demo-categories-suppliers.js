const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to database');
        removeDemoData();
    }
});

function removeDemoData() {
    console.log('Removing demo categories and suppliers...');
    
    // Demo categories to remove
    const demoCategories = ['Electronics', 'Office Supplies', 'Tools'];
    
    // Demo suppliers to remove (based on the fake contact info)
    const demoSuppliers = ['TechCorp', 'Office Plus'];
    
    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        
        // Remove demo categories
        const catPlaceholders = demoCategories.map(() => '?').join(',');
        db.run(`DELETE FROM categories WHERE name IN (${catPlaceholders})`, demoCategories, (err) => {
            if (err) {
                console.error('Error removing demo categories:', err.message);
            } else {
                console.log('✓ Removed demo categories');
            }
        });
        
        // Remove demo suppliers
        const supPlaceholders = demoSuppliers.map(() => '?').join(',');
        db.run(`DELETE FROM suppliers WHERE name IN (${supPlaceholders})`, demoSuppliers, (err) => {
            if (err) {
                console.error('Error removing demo suppliers:', err.message);
                db.run('ROLLBACK');
            } else {
                console.log('✓ Removed demo suppliers');
                db.run('COMMIT');
                console.log('\n🎉 Demo categories and suppliers removed!');
            }
            
            db.close();
        });
    });
}