const sqlite3 = require('sqlite3').verbose();

const batch3Products = [
  {"product_name": "MOODS CONDOMS -STRAWBERRY (3's)","current_price": "UGX 32,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/77/8685642/1.jpg?1407"},
  {"product_name": "Frozen Collagen Gluta 2 In 1 Original For Glowing Skin Hair And Nails Anti-aging - Blue","current_price": "UGX 100,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/80/976849/1.jpg?6637"},
  {"product_name": "Beckon Hand Cream Super Softening Smooth Hands 100g","current_price": "UGX 59,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/15/6867011/1.jpg?7386"},
  {"product_name": "Max Man A Class Version Original Herbal Male Manhood Eenlargement Cream Must Have For All Men Free Delivery - 50g","current_price": "UGX 100,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/64/3413352/1.jpg?0808"},
  {"product_name": "G & T Slimline 2 Gang Double Switched Plug Socket White Slimline - White","current_price": "UGX 39,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/12/288039/1.jpg?2271"},
  {"product_name": "Halisi Coconut Oil - 150ml","current_price": "UGX 18,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/46/3147152/1.jpg?9708"},
  {"product_name": "RENA Hibiscus Seed Snack 80g","current_price": "UGX 29,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/52/2373652/1.jpg?9557"},
  {"product_name": "Tropical Heat Delicious Curry Powder 100g","current_price": "UGX 29,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/20/615769/1.jpg?2052"},
  {"product_name": "Portable U-Shaped ow Cervical Spine Soft Flannel PP Cotton Ne ow Home Car Travel Sleeping Body ow Slept Bedding- Grey","current_price": "UGX 79,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/88/651269/1.jpg?8923"},
  {"product_name": "Tropical Heat Spices Paprika Ground 100g","current_price": "UGX 34,200","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/15/6249241/1.jpg?2207"},
  {"product_name": "Orally Disintegrating Strip for Erectile Dysfunction","current_price": "UGX 32,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/04/3096542/1.jpg?4788"},
  {"product_name": "Tropical Heat Tropical, Heat Fish Masala - 100g","current_price": "UGX 29,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/24/515769/1.jpg?2050"},
  {"product_name": "5th & Love Sexx Sexuall Arousal Chewing Gum For Men & Women Best Sexx Gum Long Lasting Sexuall Pleasure","current_price": "UGX 75,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/22/965499/1.jpg?7724","ratings": "1 out of 5"},
  {"product_name": "Dkt KISS Stubbed (DOTTED) Condoms 24 X 3","current_price": "UGX 47,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/04/626889/1.jpg?5969","ratings": "4 out of 5"},
  {"product_name": "Balay Papaya Breast Enlargment And Firming Oil 50ml","current_price": "UGX 59,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/15/279398/1.jpg?1823","ratings": "1 out of 5"},
  {"product_name": "Wins Town Hip & Big Butt Booty Enlargment Tea Herbal Supplements 30 Tea Bags","current_price": "UGX 99,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/41/099898/1.jpg?4627"},
  {"product_name": "Jussen Drinking Mulondo Powder Men Size Length Bed Wonders 100g","current_price": "UGX 40,000","original_price": "UGX 69,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/44/9105011/1.jpg?8549"},
  {"product_name": "Rusian Titan Gel For Delayed Ejaculation And Mens Enlargementt 50ml","current_price": "UGX 120,000","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/88/9930111/1.jpg?0367"},
  {"product_name": "Dr meinaier Vitamin C Face Wash Toner Acne Pimples Dark Spots Anti-Aging - 120 G","current_price": "UGX 39,900","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/52/673298/1.jpg?1823","ratings": "2.5 out of 5"},
  {"product_name": "Flamingo Spray Polish Wax 450ml - Black","current_price": "UGX 59,999","image_url": "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/03/7108011/1.jpg?1083"}
];

function generateSKU(index) {
  return `JUM${String(index + 140).padStart(3, '0')}`;
}

function truncateName(name, maxLength = 80) {
  return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
}

const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  }
  
  console.log(`Adding ${batch3Products.length} more products...`);
  
  let added = 0;
  
  batch3Products.forEach((product, index) => {
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
      
      if (added + (index + 1 - added) === batch3Products.length) {
        console.log(`\n🎉 Batch 3 complete! Added ${added} more products with 0 stock.`);
        console.log(`📊 Total products now in database: ${added + 57} (approximately)`);
        db.close();
      }
    });
  });
});