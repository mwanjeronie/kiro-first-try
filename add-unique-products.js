const sqlite3 = require('sqlite3').verbose();

// First batch of products to add
const newProducts = [
  {"product_name": "SOUTH MOON Alopecia Hair Growth Cream: A Proven Solution for Hair Loss and Stronger Hair 20g","current_price": "UGX 57,000","original_price": "UGX 71,500","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/49/7366332/1.jpg?5890"},
  {"product_name": "Omega-3 Fish Oil - 60 Soft Gels - 1250 Mg","current_price": "UGX 80,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/58/9686152/1.jpg?5093"},
  {"product_name": "Minoxidil Baldness Hairline Beard Growth Allopecia Hair Growth Oitment","current_price": "UGX 50,000","original_price": "UGX 75,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/05/8876671/1.jpg?7959","ratings": "1 out of 5"},
  {"product_name": "Kiss Condoms Kiss Condoms, - (72) Pieces In A Box","current_price": "UGX 40,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/19/566739/1.jpg?0363","ratings": "4 out of 5"},
  {"product_name": "RENA Hibiscus Powder Tea 200g (Organic)","current_price": "UGX 50,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/68/5653652/1.jpg?6553"},
  {"product_name": "Omega-3 Fish Oil - 120 Soft Gels - 1250 Mg","current_price": "UGX 145,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/25/2625152/1.jpg?9981"},
  {"product_name": "Smoker Active Oral Care with Activated Charcoal Fluoride Toothpaste Uk Made 125ml","current_price": "UGX 69,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/91/250959/1.jpg?8863"},
  {"product_name": "Kentaste Extra Virgin Coconut Oil 100% Virgin 1Lr","current_price": "UGX 135,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/95/8930111/1.jpg?0433"},
  {"product_name": "Ors ORS, Olive Oil Girls - Hair Lotion, Moisturizing Styling 8.5 oz","current_price": "UGX 39,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/86/207399/1.jpg?3026"},
  {"product_name": "Angel Clover Love Jojo 3 Days Anti-aging Anti-wrinkle Antioxidant Vitamin E Face Serum - 30ml","current_price": "UGX 49,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/98/1500001/1.jpg?1165"},
  {"product_name": "Weight Fatnile 14 Days Aggressive Fat Reduction Formula From London 60 Caps","current_price": "UGX 250,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/93/858429/1.jpg?4213"},
  {"product_name": "Clovers Laundry Starch Makes Fabric Crisp 400g","current_price": "UGX 25,000","original_price": "UGX 29,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/46/207399/1.jpg?2665","ratings": "5 out of 5"},
  {"product_name": "Downy Perfume Collection Concentrate Fabric Softener Vanilla & Cashmere Musk Value Pack 880ml","current_price": "UGX 95,000","original_price": "UGX 115,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/18/4855512/1.jpg?3227"},
  {"product_name": "Fruit Of The Wokali Fast Breast Firming Fully Organic Cream","current_price": "UGX 85,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/07/594769/1.jpg?2046"},
  {"product_name": "Car Dashboard Air Freshner","current_price": "UGX 54,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/97/4886011/1.jpg?5898","ratings": "4.5 out of 5"},
  {"product_name": "Flamingo Car Wash Waxi Shiny Glittering Car Surface Wax.","current_price": "UGX 85,000","original_price": "UGX 99,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/57/1714001/1.jpg?0956","ratings": "4 out of 5"},
  {"product_name": "Plump Breast Cream - Natural Firming Solutions","current_price": "UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/90/8572952/1.jpg?5789"},
  {"product_name": "Downy NEW Downy, Sunrise Fresh Fabric Softener Extra Effective – 900ml","current_price": "UGX 109,000","original_price": "UGX 120,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/64/6955512/1.jpg?4068"},
  {"product_name": "Fruit Of The Wokali Snail Repairing Cream Improve Dellness ,Darkness & Spots Face","current_price": "UGX 29,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/72/076799/1.jpg?4965","ratings": "1 out of 5"},
  {"product_name": "Downy NEW NEW Downy, Sweet Fabric Softener 900Ml","current_price": "UGX 109,000","original_price": "UGX 120,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/57/5855512/1.jpg?3767"}
];

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/UGX\s*|,/g, '')) || 0;
}

function generateSKU(index) {
  return `JUM${String(index + 100).padStart(3, '0')}`;
}

function truncateName(name, maxLength = 80) {
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
}

const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  
  console.log(`Adding ${newProducts.length} new products...`);
  
  let added = 0;
  
  newProducts.forEach((product, index) => {
    const sku = generateSKU(index);
    const name = truncateName(product.product_name);
    const description = `Imported from Jumia Uganda. ${product.ratings ? `Rating: ${product.ratings}` : ''}`.trim();
    const imageUrl = product.image_url;
    const unitPrice = parsePrice(product.current_price);
    const costPrice = product.original_price ? parsePrice(product.original_price) : unitPrice * 0.7;
    
    const sql = `INSERT INTO products (sku, name, description, image_url, category_id, supplier_id, min_stock, max_stock) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [sku, name, description, imageUrl, 1, 1, 5, 100], function(err) {
      if (err) {
        console.error(`❌ Error adding ${name}: ${err.message}`);
      } else {
        // Set inventory to 0 as requested
        db.run('INSERT INTO inventory (product_id, quantity) VALUES (?, 0)', [this.lastID]);
        console.log(`✅ Added: ${name} (${sku})`);
        added++;
      }
      
      if (added + (index + 1 - added) === newProducts.length) {
        console.log(`\n🎉 Import complete! Added ${added} new products with 0 stock.`);
        db.close();
      }
    });
  });
});