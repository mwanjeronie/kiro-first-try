const sqlite3 = require('sqlite3').verbose();

const batch2Products = [
  {"product_name": "Downy Fabric softener, Luxury perfume, Lavender and white musk, 880 ml","current_price": "UGX 95,000","original_price": "UGX 110,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/11/1275512/1.jpg?2950"},
  {"product_name": "DR Rashel PH-Balanced Feminine Intimate Foaming Wash","current_price": "UGX 45,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/29/7981052/1.jpg?3225"},
  {"product_name": "All clear Skin Balance Gel Wrinkle Remover 30g","current_price": "UGX 65,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/33/858429/1.jpg?8288"},
  {"product_name": "Collagen Liru Professional Care Collagen, Vitammin C Face Serum Multi- Function Essence - 30ml","current_price": "UGX 59,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/93/542569/1.jpg?1018"},
  {"product_name": "Best Slim Flat Belly Tea Cleanse Activate Detox Tea Bags, Laxative Skinny Fit Detox Tea for Weight Loss and Belly Fat Caffeine Free, Organic Natural Herbal Slimming Detox Tea for Bloating","current_price": "UGX 150,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/78/8783701/1.jpg?6393"},
  {"product_name": "Largo Enlargementt Cream - 50g","current_price": "UGX 50,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/34/0999821/1.jpg?3155","ratings": "1.3 out of 5"},
  {"product_name": "Aichun Beauty 24K Pure G0LD Whitening Toothpaste Remove Stains Repair Sensitive Teeth Fresh Breath 100ml/3.38oz","current_price": "UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/80/5399052/1.jpg?0315"},
  {"product_name": "SMIO HEALTH Weight Weight For Muscle Gain Creatine Monohydrate","current_price": "UGX 129,000","original_price": "UGX 165,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/70/1567251/1.jpg?8271"},
  {"product_name": "Dog & Co Chunks healthy Dog Food Can Rabbit And Duck","current_price": "UGX 49,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/09/342569/1.jpg?6812"},
  {"product_name": "Dog & Co Dog & co, chicken and turkey","current_price": "UGX 49,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/88/342569/1.jpg?6812"},
  {"product_name": "Saachi Unique Bundle Of, Green Kettle ,Extension, Flat Iron -Green","current_price": "UGX 138,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/59/441909/1.jpg?9788","ratings": "3 out of 5"},
  {"product_name": "Rivaj London Now White Teeth Whitening Toothpaste - 100ml","current_price": "UGX 55,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/67/506119/1.jpg?0869","ratings": "3 out of 5"},
  {"product_name": "Weight Bio-slim Active Capsules 14 Days Aggressive Fat Reduction Formula From London 60 Caps, Fatnile Formula","current_price": "UGX 170,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/50/2224252/1.jpg?8083"},
  {"product_name": "Sensodyne Deep Clean Gel Toothpaste 75ml","current_price": "UGX 85,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/16/6249241/1.jpg?2207"},
  {"product_name": "Booty Magic Butt Lift & Firming Gel - Alcohol-Free, Vitamin C Enriched For All Skin Types, Summer Scented","current_price": "UGX 80,000","original_price": "UGX 110,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/05/6505742/1.jpg?6446"},
  {"product_name": "RENA Health Promoting Hibiscus Tea Bags 120g 60 Tea Bags","current_price": "UGX 99,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/47/8233652/1.jpg?2131"},
  {"product_name": "Frozen Collagen Gluta 2 In 1 60 Capsules Original For Glowing Skin Hair And Nails - Blue","current_price": "UGX 120,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/90/976849/1.jpg?6604"},
  {"product_name": "Brown Orchid Excellent Special Edition Perfume For Men - 80ml","current_price": "UGX 64,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/85/901789/1.jpg?7653","ratings": "4 out of 5"},
  {"product_name": "Flamingo 300ml Car Headlight Restorer Headlamp Polish Light Cleaner Lamp Lense Brightener Headlight Restoration Kit For Auto","current_price": "UGX 100,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/87/4886011/1.jpg?0867","ratings": "4.3 out of 5"},
  {"product_name": "Flamingo Cleans the Toughest Automotive Dirt and Grime","current_price": "UGX 85,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/96/4886011/1.jpg?0866"}
];

function generateSKU(index) {
  return `JUM${String(index + 120).padStart(3, '0')}`;
}

function truncateName(name, maxLength = 80) {
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
}

const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  
  console.log(`Adding ${batch2Products.length} more products...`);
  
  let added = 0;
  
  batch2Products.forEach((product, index) => {
    const sku = generateSKU(index);
    const name = truncateName(product.product_name);
    const description = `Imported from Jumia Uganda. ${product.ratings ? `Rating: ${product.ratings}` : ''}`.trim();
    const imageUrl = product.image_url;
    
    const sql = `INSERT INTO products (sku, name, description, image_url, category_id, supplier_id, min_stock, max_stock) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [sku, name, description, imageUrl, 1, 1, 5, 100], function(err) {
      if (err) {
        console.error(`❌ Error adding ${name}: ${err.message}`);
      } else {
        db.run('INSERT INTO inventory (product_id, quantity) VALUES (?, 0)', [this.lastID]);
        console.log(`✅ Added: ${name} (${sku})`);
        added++;
      }
      
      if (added + (index + 1 - added) === batch2Products.length) {
        console.log(`\n🎉 Batch 2 complete! Added ${added} more products with 0 stock.`);
        db.close();
      }
    });
  });
});