const moreProducts = [
  { name: "New Improved Mosquito/insect Killer, Trap, Swatter-green,white", price: 48000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/27/4886011/1.jpg?5641" },
  { name: "Dr Davey Original Super Fast True Vitamin C Beard Growth Oil 30ml", price: 43900, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/18/7678511/1.jpg?6845" },
  { name: "Parachute 100% Organic And Pure Edible Coconut Oil 500ml - 1pc", price: 56999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/70/746469/1.jpg?6147" },
  { name: "Andrea HAIR GROWTH ESSENCE Hair Loss Scalp Treatments 20Ml", price: 45000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/69/701789/1.jpg?9504" },
  { name: "Dr meinaier Vitamin E Face Essence Oil Morning & Night 75ml", price: 45000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/07/348399/1.jpg?2443" },
  { name: "RENA Rosemary Powder 170g", price: 59999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/85/754869/1.jpg?8547" },
  { name: "Classy Touch Single Electric Hot Plate – White", price: 59999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/14/762079/1.jpg?5762" },
  { name: "Anskin Liru Alcohol-Free Vitamin C Witch Hazel Facial Toner 120ML", price: 100000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/04/542569/1.jpg?6868" },
  { name: "Neocell Marine Collagen Plus Hyaluronic Acid Capsules, 120 Count", price: 220000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/85/3083441/1.jpg?9477" },
  { name: "G & T Sline 1 Gang 45a Double Pole Appliance Cooker Switch", price: 65000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/99/678039/1.jpg?2269" },
  { name: "Simba Mbili Delicious Original Genuine Organic Curry Powder 500G", price: 45000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/14/853179/1.jpg?5823" },
  { name: "Movit Hair Shampoo Strawberry - 1L NeW", price: 29000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/08/471429/1.jpg?0693" },
  { name: "Parachute Oil Pure Organic Therapeutic Oil Coconut Oil 200 ml", price: 45000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/01/727999/1.jpg?5063" },
  { name: "RENA Mpirivuma Seed Coffee- 250g", price: 59999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/75/754869/1.jpg?8609" },
  { name: "aGLOW Extreme Papaya Skin Brightening Glow Body Scrub - 500ml", price: 59999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/53/580139/1.jpg?2276" },
  { name: "Karan AHA, Fruit Extract, Vitamin C Body Essence Serum", price: 99999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/70/642569/1.jpg?6933" },
  { name: "Original 2.0 Litre Large Electric Kettle Percolator - Army Green", price: 59999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/71/175019/1.jpg?0967" },
  { name: "U-Shaped Travel Car Flight Super Soft Plush Fabric Support Headrest", price: 69999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/88/566739/1.jpg?9668" },
  { name: "RENA Okra Seed Coffee 250g (Very Good For Women Water)", price: 69999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/21/642569/1.jpg?6830" },
  { name: "Aichun Beauty Mens Beard Care Pure Natural Nutrients Beard Wash", price: 48000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/58/9141942/1.jpg?8049" },
  { name: "Jasmine Super Slimming Herbal Tea For Tummy Fat Burning", price: 100000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/92/4193001/1.jpg?7944" },
  { name: "A Class Version Original Herbal Male Manhood Size Cream - 50g", price: 100000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/40/131869/1.jpg?8548" },
  { name: "Lanbena Powerful Ginger Hair Growth Bald Head Find Lost Hair. 20ml", price: 38500, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/43/476119/1.jpg?9023" },
  { name: "Fruit Of The Wokali Hydrating Sooth Skin Toner 400ml", price: 55000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/51/866799/1.jpg?2024" },
  { name: "Fruit Of The Wokali Vitamin E Skin Care Cream", price: 55000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/45/553499/1.jpg?6005" },
  { name: "Actman Real Drinking Mulondo Powder From Mulondo Roots 120g", price: 39999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/77/7510001/1.jpg?6284" },
  { name: "Dr Davey Super Fast True Vitamin C Beard Growth Oil 30ml", price: 49999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/45/279398/1.jpg?1883" },
  { name: "Daqan Sunscreen Fps 90+ Sunscreen 3 In 1 Cream 60g", price: 59999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/70/330769/1.jpg?2009" },
  { name: "Fruit Of The Wokali Vitamin E Conditioner (500ml)", price: 55000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/02/918399/1.jpg?7892" },
  { name: "Men Big Penis Enlargment Cream Lasting Sex Gel", price: 80000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/86/4770442/1.jpg?0454" },
  { name: "Faded Serum For Dark Spots & Discoloration 50 Ml / 1.7 Fl Oz", price: 150000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/89/0026442/1.jpg?2553" }
];

async function addProduct(product, index) {
  const sku = `JUM${String(index + 6).padStart(3, '0')}`;
  
  const productData = {
    sku: sku,
    name: product.name.length > 80 ? product.name.substring(0, 80) + '...' : product.name,
    description: "Imported from Jumia Uganda marketplace",
    image_url: product.image,
    category_id: 1,
    supplier_id: 1,
    unit_price: product.price,
    cost_price: product.price * 0.7,
    min_stock: 5,
    max_stock: 100
  };

  try {
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });

    if (response.ok) {
      console.log(`✓ Added: ${productData.name} (${sku}) - UGX ${product.price.toLocaleString()}`);
    } else {
      console.log(`✗ Failed to add: ${productData.name}`);
    }
  } catch (error) {
    console.log(`✗ Error adding ${productData.name}: ${error.message}`);
  }
}

async function addAllProducts() {
  console.log(`Adding ${moreProducts.length} more products to inventory...`);
  
  for (let i = 0; i < moreProducts.length; i++) {
    await addProduct(moreProducts[i], i);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('Done! All products added with 0 stock as requested.');
}

addAllProducts();