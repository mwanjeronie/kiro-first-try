const sqlite3 = require('sqlite3').verbose();

// Product data from JSON (first 10 products for testing)
const productsData = [
  {"product_name": "Active Drinking Mulondo Powder Men Size Length Bed Wonders 100g","current_price": "UGX 28,500","original_price": "UGX 40,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/05/5559512/1.jpg?5323","ratings": "4.1 out of 5"},
  {"product_name": "Derma Roller Titanium Hair Growth Hair Regrow Beard Growth Micro Needle Tool","current_price": "UGX 35,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/79/0878511/1.jpg?9612","ratings": "4.7 out of 5"},
  {"product_name": "Hitz Hitzz Bedbugs Insect Killer Spray - 400ml","current_price": "UGX 41,500","original_price": "UGX 43,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/73/3232751/1.jpg?7029","ratings": "3 out of 5"},
  {"product_name": "Oraquick Fast And Simple Home HIV Self Test Kit","current_price": "UGX 45,000","original_price": "UGX 50,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/00/2441432/1.jpg?3509"},
  {"product_name": "Snail Anti-Aging Wrinkle Skin Glow Soap 100g","current_price": "UGX 19,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/55/279398/1.jpg?1822","ratings": "5 out of 5"}
];

// Helper functions
function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/UGX\s*|,/g, '')) || 0;
}

function generateSKU(productName, index) {
  const words = productName.split(' ').slice(0, 3);
  const prefix = words.map(word => word.charAt(0).toUpperCase()).join('');
  return `${prefix}${String(index + 1).padStart(3, '0')}`;
}

function truncateName(name, maxLength = 80) {
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
}

// Connect to database and import
const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Error ssage);
    process.exit(1);
  }
  
  console.log(`Starting import of ${productsData.length} products...`);
  
  let imported = 0;
  
  productsData. => {
    const sku );
    const name = truncateName(product.product_name);
    const description = `Imported from Jumia Ug
    const imageUrl = product.image_url;
    const unitPrice = parsePrice(product.current_price);
    const costPrice = product.original_p
    
    const sql = `INSERT INTO products (sku, name, des
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    
    db.ru {
      if (e
        console.error(`Error;
   {
        // Set inventory to 0 as requested
        db.run('INSEID]);

        im
      }
      
      if (imported === productsData.length) {
     );
        db.close()
        process.exit(0);
      }
    });
  });
});