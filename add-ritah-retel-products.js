const sqlite3 = require('sqlite3').verbose();

// Products from Ritah's Store and Retel
const newProducts = [
  {"product_name": "Vitabiotics Ultra Vitamin D3 1000IU 96'S","current_price": "UGX 150,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/21/5578031/1.jpg?1117"},
  {"product_name": "Special Quality Sound Music Original High Quality Wire Earphones Earbuds For All Phones- White","current_price": "UGX 20,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/04/6209111/1.jpg?8272"},
  {"product_name": "Perfectil Platinum Max Tabs/Caps 84'S","current_price": "UGX 450,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/99/1538031/1.jpg?3592"},
  {"product_name": "Wokali Pure Oilve Oil 180 ml Moist Care","current_price": "UGX 53,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/83/6572952/1.jpg?0569"},
  {"product_name": "Vaseline Intensive Care Aloe Soothe Body Lotion 400ml","current_price": "UGX 99,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/51/7117311/1.jpg?9264"},
  {"product_name": "Yoni Soap Bar -100g For Cleansing The Most Senstive Area Of Women","current_price": "UGX 35,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/19/6996352/1.jpg?2594"},
  {"product_name": "Scarlet Steel Kettle, 2.0 Litres with Free Extension Cable - Silver, White","current_price": "UGX 65,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/12/3433211/1.jpg?3809"},
  {"product_name": "7 Speed Electric Hand Mixer 260W - White","current_price": "UGX 109,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/26/2860131/1.jpg?7752"},
  {"product_name": "OvaBoost Capsules For Women 120'S","current_price": "UGX 850,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/83/9516311/1.jpg?2027"},
  {"product_name": "Natures Bounty Beautiful Skin With Hyaluronic","current_price": "UGX 295,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/66/9516311/1.jpg?2984"},
  {"product_name": "Xpel XBC Body Care Aqueous Cream 500ml","current_price": "UGX 109,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/21/4978152/1.jpg?3635"},
  {"product_name": "Flamingo QUICK FRESH DEODORIZER PRODUCT 220ML","current_price": "UGX 45,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/34/8237742/1.jpg?3755"},
  {"product_name": "Dry Flat Iron Box - Grey,Silver","current_price": "UGX 75,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/12/5109031/1.jpg?4265"},
  {"product_name": "Hair Culture Dr. Alma's Ultimate Alopecia and Baldness Cure Fast-Acting Hair Regrowth Solution","current_price": "UGX 150,000","original_price": "UGX 175,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/73/7416712/1.jpg?0453"},
  {"product_name": "Haliborange Multivitamin Liquid 250ml","current_price": "UGX 90,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/88/1266311/1.jpg?4705"},
  {"product_name": "Perfectil Platinum Skin Extra Support Tabs/Caps 56'S","current_price": "UGX 300,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/13/5538031/1.jpg?0625"},
  {"product_name": "Neck Therapuetic Pillow Navy Blue","current_price": "UGX 59,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/12/5209111/1.jpg?8257"},
  {"product_name": "Borl 6 Ways Heavy Duty Extension Socket - White","current_price": "UGX 75,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/06/9139031/1.jpg?4651"},
  {"product_name": "Frozen Detox Fiberry 2 In 1","current_price": "UGX 80,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/51/4569252/1.jpg?6413"},
  {"product_name": "Daqan Original Magical Fast Beard Growth Oil For Men – 50ml","current_price": "UGX 150,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/85/6209111/1.jpg?8361"},
  {"product_name": "Perfectil Skin Extra Support Tabs/Caps 56'S","current_price": "UGX 350,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/47/9516311/1.jpg?4004"},
  {"product_name": "Flamingo TYRE & LEATHER POLISH Peach 450ml","current_price": "UGX 63,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/99/6032052/1.jpg?5179"},
  {"product_name": "Oraimo 20000mAh 2.1A Triple Ports Fast Charging - Black","current_price": "UGX 153,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/91/1162211/1.jpg?7347"},
  {"product_name": "2L Stainless Steel Vacuum Flask - Silver","current_price": "UGX 79,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/57/0162211/1.jpg?7137"},
  {"product_name": "Flamingo ORGANIC AIR FRESHENER - Ice","current_price": "UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/26/9311052/1.jpg?7068"},
  {"product_name": "Rexona Free Spirit Deodorant Roll On 50ml","current_price": "UGX 57,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/77/9027311/1.jpg?8165"},
  {"product_name": "Siliver Ion Beauty Soap -100g For Cleansing The Most Senstive Area Of Women","current_price": "UGX 40,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/23/7996352/1.jpg?4349"},
  {"product_name": "Tightening Soap - 135g","current_price": "UGX 28,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/69/4981052/1.jpg?3338"},
  {"product_name": "Flamingo ORGANIC AIR FRESHENER - Gums","current_price": "UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/16/9311052/1.jpg?7068"},
  {"product_name": "PentaSure DM Diabetes Care Vanilla Powder 400gm","current_price": "UGX 295,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/45/2770211/1.jpg?8404"},
  {"product_name": "Power King Bundle of Flat Iron, Scarlet Kettle,2 litre & Six Way Cable","current_price": "UGX 135,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/22/3433211/1.jpg?3812"},
  {"product_name": "valupak Zinc Tablets 60'S","current_price": "UGX 109,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/11/5578031/1.jpg?1117"},
  {"product_name": "Fat Burner , Weight Management, Metabolism Booster & Blocker , Muscle Healing & Healthy Detox Formula","current_price": "UGX 110,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/86/7996352/1.jpg?2597"},
  {"product_name": "Movit Radiant conditioning crème hair relaxer 4kg","current_price": "UGX 150,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/54/9071211/1.jpg?1486"},
  {"product_name": "Perfectil Platinum Original Tablets 30'S","current_price": "UGX 165,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/65/3538031/1.jpg?0388"},
  {"product_name": "Sensodyne Extra Fresh Toothpaste 40ml","current_price": "UGX 39,500","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/81/3027311/1.jpg?5224"},
  {"product_name": "Forever Aloe Vera Gel Drink 1L Cleansing Digestive Tract Absorb Nutrients While Promoting Normal Flora","current_price": "UGX 450,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/90/3770211/1.jpg?9418"},
  {"product_name": "Bundle Of Original Non Stick Flat Iron And Original Power King 4Way Power King Extension Cable- 3Metres - White","current_price": "UGX 89,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/43/7952211/1.jpg?6328"},
  {"product_name": "Haliborange Effervescent Black Currant Tablets 20'S","current_price": "UGX 109,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/26/6117311/1.jpg?7165"},
  {"product_name": "Vitabiotics Neuromind Original Tablets 30'S BrainBooster","current_price": "UGX 250,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/98/1266311/1.jpg?4706"},
  {"product_name": "Movit Baby Powder","current_price": "UGX 49,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/27/8071211/1.jpg?1496"},
  {"product_name": "Liru Accelerate Facial Hair Growth Men's Treatment Beard Oil 30ML","current_price": "UGX 165,500","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/68/6209111/1.jpg?8417"},
  {"product_name": "Seven Seas Original Cod Liverr Oil 450ml","current_price": "UGX 150,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/51/5578031/1.jpg?1115"},
  {"product_name": "Movit Baby Oil","current_price": "UGX 65,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/00/7770211/1.jpg?5044"},
  {"product_name": "WEIGHT OFF Women Womb Tea,Traditional Medicinals Healthy Cycle Formerly Female Toner Tea","current_price": "UGX 99,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/85/0532511/1.jpg?4730"},
  {"product_name": "Flamingo ORGANIC AIR FRESHENER - Vanilla","current_price": "UGX 60,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/47/9311052/1.jpg?7068"},
  {"product_name": "valupak Garlic Capsules 30'S","current_price": "UGX 55,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/01/5578031/1.jpg?1117"},
  {"product_name": "Winstown 3 Days Hip & Big Butt Capsules - 600mg X 60 Capsules","current_price": "UGX 275,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/18/5902921/1.jpg?6307"},
  {"product_name": "Flamingo FOAM CLEANER","current_price": "UGX 56,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/95/8237742/1.jpg?2690"},
  {"product_name": "Rugby Benzoyl Peroxide 5% Acne Medication Gel 42.5g","current_price": "UGX 125,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/03/7330411/1.jpg?1747"},
  {"product_name": "Jergens Age Defying Revitalizing And Replenishing Lotion- 621ml.","current_price": "UGX 59,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/28/5209111/1.jpg?8261"},
  {"product_name": "Flamingo TYRE & LEATHER POLISH Lemon 220ml","current_price": "UGX 40,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/42/5032052/1.jpg?4134"}
];

function parsePrice(priceStr) {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/UGX\s*|,/g, '')) || 0;
}

function generateSKU(index) {
  return `RIT${String(index + 160).padStart(3, '0')}`;
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
  
  console.log(`Processing ${newProducts.length} products from Ritah's Store and Retel...`);
  
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
    
    newProducts.forEach((product, index) => {
      const normalizedName = normalizeProductName(product.product_name);
      
      // Check if product already exists
      if (existingProducts.includes(normalizedName)) {
        console.log(`⏭️  Skipped (duplicate): ${product.product_name.substring(0, 60)}...`);
        skipped++;
        processed++;
        
        if (processed === newProducts.length) {
          console.log(`\n🎉 Import complete!`);
          console.log(`✅ Added: ${added} new products`);
          console.log(`⏭️  Skipped duplicates: ${skipped} products`);
          console.log(`📦 All products have 0 stock as requested`);
          db.close();
        }
        return;
      }
      
      const sku = generateSKU(index);
      const name = truncateName(product.product_name);
      const description = `Imported from Jumia Uganda (Ritah's Store/Retel)`;
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
        if (processed === newProducts.length) {
          console.log(`\n🎉 Import complete!`);
          console.log(`✅ Added: ${added} new products`);
          console.log(`⏭️  Skipped duplicates: ${skipped} products`);
          console.log(`📦 All products have 0 stock as requested`);
          db.close();
        }
      });
    });
  });
});