const sqlite3 = require('sqlite3').verbose();

// Final batch of products from the JSON data
const finalProducts = [
  {"product_name": "Emergency Light Rechargeable With Long-lasting Battery, LED Bulbs, 1200mAh Emergency Light With High Light And Dim Light, Water-resistant And Portable","current_price": "UGX 80,000","original_price": "UGX 100,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/94/8922942/1.jpg?9928","ratings": "2 out of 5"},
  {"product_name": "Jena Herbals JenaSM - 1L Natural Support For Sickle Cell Disease Management","current_price": "UGX 45,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/12/4091052/1.jpg?4826"},
  {"product_name": "Alpecin Double Effect Shampoo 200ml","current_price": "UGX 250,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/91/0074961/1.jpg?2371"},
  {"product_name": "MOODS CONDOMS - UltraLONG 3 Pcs","current_price": "UGX 32,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/67/8685642/1.jpg?1408"},
  {"product_name": "Sensitive Areas Dark Knees Elbows Body Lightening Cream Dark Skin Bleaching Whitening Cream","current_price": "UGX 72,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/86/9370252/1.jpg?8488"},
  {"product_name": "Wins Town Immune Booster Tea,20 Herbal Tea Bags","current_price": "UGX 164,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/83/5418442/1.jpg?7699"},
  {"product_name": "Lamp Desk College Student Chartered Dormitory Study Bedside Reading Lamp","current_price": "UGX 70,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/13/7972252/1.jpg?5749"},
  {"product_name": "Kentaste Coconut Chips Shredded, Dried, And Baked Coconut Snack 100% Cholesterol Free Gluten Free And Vegan, Original Flavor","current_price": "UGX 22,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/30/6127152/1.jpg?8554"},
  {"product_name": "LED Small Table Lamp Student Dormitory With Plug-in Charging To Control Switch Dual-use Girl Wind","current_price": "UGX 63,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/60/9252152/1.jpg?7372"},
  {"product_name": "Frozen Collagen Pure Collagen + Glutathione + Vitamin C","current_price": "UGX 100,000","original_price": "UGX 200,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/23/4047442/1.jpg?6705","ratings": "5 out of 5"},
  {"product_name": "Tropikal Lemon 2 In 1 Car Dashboard Polish & Freshener","current_price": "UGX 40,000 - UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/95/6639352/1.jpg?4701"},
  {"product_name": "Desklight Learning Special Eye Lamp Student Reading And Writing Learning Lamp","current_price": "UGX 120,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/03/0450152/1.jpg?7463"},
  {"product_name": "Karis Carrot Brightening Booster Body Lotion - 400ml","current_price": "UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/05/1292942/1.jpg?8542"},
  {"product_name": "LED Camouflage Bear Learning To Read Desk Lamps Mini Night Lamps","current_price": "UGX 68,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/02/9252152/1.jpg?9867"},
  {"product_name": "Tropikal Deluxe WOOD SILK POLISHES Premium - 315ml Elevate The Natural Beauty Of Your Wood Surfaces","current_price": "UGX 43,000","original_price": "UGX 45,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/76/9539352/1.jpg?0988"},
  {"product_name": "Karis Papaya Brightening Glow Body Lotion - 400ml","current_price": "UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/53/1292942/1.jpg?2198"},
  {"product_name": "Jena Herbals JenaMos 200ml Herbal Support For Malaria Prevention.","current_price": "UGX 43,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/91/4091052/1.jpg?4826"},
  {"product_name": "Karis Lemon Brightening Beauty Body Lotion - 400ml","current_price": "UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/04/0832942/1.jpg?1595"},
  {"product_name": "Tropikal Lavender WOOD SILK POLISHES Premium - 315ml Elevate The Natural Beauty Of Your Wood Surfaces","current_price": "UGX 45,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/21/9539352/1.jpg?0569"},
  {"product_name": "Himalaya Sensi-Relief Herbal Toothpaste 75ml","current_price": "UGX 55,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/94/2930542/1.jpg?2687"},
  {"product_name": "Tropikal Lavender 2 In 1 Car Dashboard Polish & Freshener","current_price": "UGX 40,000 - UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/73/4639352/1.jpg?4779"},
  {"product_name": "Tropikal Yellow Can WOOD SILK POLISHES - 315ml Elevate The Natural Beauty Of Your Wood Surfaces","current_price": "UGX 39,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/18/0639352/1.jpg?0988"},
  {"product_name": "Karis Milk & Vitamins Brightening + Moisturizing Body Lotion - 400ml","current_price": "UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/77/1292942/1.jpg?8544"},
  {"product_name": "Lamp Creative Fan Desk Lamp","current_price": "UGX 147,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/23/9252152/1.jpg?0422"},
  {"product_name": "Tropikal Deluxe WOOD SILK POLISHES - 315ml Elevate The Natural Beauty Of Your Wood Surfaces","current_price": "UGX 40,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/99/9539352/1.jpg?0988"},
  {"product_name": "Supplement Of Maintaining Heathy Body Weight.","current_price": "UGX 50,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/99/8252152/1.jpg?7373"},
  {"product_name": "LED Camouflage Bear Learning To Read Desk Lamps Mini Night Lamps","current_price": "UGX 28,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/21/9252152/1.jpg?8647"},
  {"product_name": "Kentaste Coconut Chips Shredded, Dried, And Baked Coconut Snack 100% Cholesterol Free Gluten Free And Vegan, Chocolate Flavor","current_price": "UGX 22,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/20/6127152/1.jpg?8554"},
  {"product_name": "Multi-functional Learning Special Folding Table Lamps Children's Eye-catching, Desktop Bedside Lamp Students Charge Plug","current_price": "UGX 100,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/30/9252152/1.jpg?9951"},
  {"product_name": "MOODS CONDOMS 3 Pcs","current_price": "UGX 28,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/97/8685642/1.jpg?1407","ratings": "5 out of 5"},
  {"product_name": "DARK SPOT REMOVAL CREAM WHITENING FRECKLE CREAM","current_price": "UGX 74,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/86/0270252/1.jpg?4129"},
  {"product_name": "MOODS CONDOMS - Dotted 3 Pcs","current_price": "UGX 32,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/73/9345642/1.jpg?3332"},
  {"product_name": "Organic -Ashvagandha Builds Strength And Immunity By Improving The Overall Capacity Of The Body To Fight Infections And Diseases.","current_price": "UGX 112,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/33/5017252/1.jpg?1827"},
  {"product_name": "Boy's Desk Lamp Cartoon Tyrannosaurus Dinosaur Table Small Table Lamp Students Eye-catching Learning Bedroom Bedside Lamp","current_price": "UGX 29,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/01/9252152/1.jpg?0659"},
  {"product_name": "Marine Skin Whitening Brightening Hair Nails Smooth Acne Wrinkle Removing Beauty","current_price": "UGX 120,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/69/3017252/1.jpg?1843"},
  {"product_name": "Tropikal Strawberry 2 In 1 Car Dashboard Polish & Freshener","current_price": "UGX 40,000 - UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/71/7639352/1.jpg?6554"},
  {"product_name": "Kentaste Desiccated Coconut -100g Delicious Desiccated Coconut To Bring The Rich, Tropical Taste Of Coconut Into Your Life","current_price": "UGX 25,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/75/5725152/1.jpg?9954"},
  {"product_name": "ASTRONAUT LED SMALL DESK LAMP Astronaut LED Lamp Children's Kindergarten Birthday Small Gift Prizes Practical Gifts","current_price": "UGX 31,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/73/9252152/1.jpg?0420"},
  {"product_name": "Kentaste Coconut Milk - 250ml For Your Favourite Sauces, Desserts, Drinks, Curries And More!","current_price": "UGX 25,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/16/4725152/1.jpg?9960"},
  {"product_name": "Creative Learning Desk Lamp Diamond Head USB Charged Touch Control Desktop Lamp Bed Lamp Bedroom Light","current_price": "UGX 48,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/41/2434152/1.jpg?1348"}
];

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  // Handle price ranges by taking the first price
  const cleanPrice = priceStr.split(' - ')[0];
  return parseFloat(cleanPrice.replace(/UGX\s*|,/g, '')) || 0;
}

function generateSKU(index) {
  return `RTL${String(index + 212).padStart(3, '0')}`;
}

function truncateName(name, maxLength = 80) {
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
}

function normalizeProductName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 50);
}

const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  
  console.log(`Processing final batch of ${finalProducts.length} products...`);
  
  // Get existing products to avoid duplicates
  db.all('SELECT name FROM products', [], (err, rows) => {
    if (err) {
      console.error('Error getting existing products:', err.message);
      return;
    }
    
    const existingProducts = rows.map(row => normalizeProductName(row.name));
    console.log(`Found ${existingProducts.length} existing products in database`);
    
    let added = 0;
    let skipped = 0;
    let processed = 0;
    
    finalProducts.forEach((product, index) => {
      const normalizedName = normalizeProductName(product.product_name);
      
      // Check if product already exists
      if (existingProducts.includes(normalizedName)) {
        console.log(`⏭️  Skipped (duplicate): ${product.product_name.substring(0, 60)}...`);
        skipped++;
        processed++;
        
        if (processed === finalProducts.length) {
          console.log(`\n🎉 Final batch complete!`);
          console.log(`✅ Added: ${added} new products`);
          console.log(`⏭️  Skipped duplicates: ${skipped} products`);
          console.log(`📦 All products have 0 stock as requested`);
          db.close();
        }
        return;
      }
      
      const sku = generateSKU(index);
      const name = truncateName(product.product_name);
      const description = `Imported from Jumia Uganda (Retel). ${product.ratings ? `Rating: ${product.ratings}` : ''}`.trim();
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
        
        processed++;
        if (processed === finalProducts.length) {
          console.log(`\n🎉 Final batch complete!`);
          console.log(`✅ Added: ${added} new products`);
          console.log(`⏭️  Skipped duplicates: ${skipped} products`);
          console.log(`📦 All products have 0 stock as requested`);
          
          // Get final count
          db.get('SELECT COUNT(*) as total FROM products', [], (err, row) => {
            if (!err && row) {
              console.log(`🏆 Total products in database: ${row.total}`);
            }
            db.close();
          });
        }
      });
    });
  });
});