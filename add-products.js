const products = [
  { name: "New Improved Mosquito/insect Killer, Trap, Swatter-green,white", price: 48000, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/27/4886011/1.jpg?5641" },
  { name: "Dr Davey Original Super Fast True Vitamin C Beard Growth Oil 30ml", price: 43900, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/18/7678511/1.jpg?6845" },
  { name: "Parachute 100% Organic And Pure Edible Coconut Oil 500ml - 1pc", price: 56999, image: "https://ug.jumia.is/unsafe/fit-in/300x300/filters:fill(white)/product/70/746469/1.jpg?6147" },
  { name: "Andrea HAIR GROWTH ESSENCE Hair Loss Scalp Treatments 20Ml", price: 45000, image: "https://ug
  { 43" },
  {" },
  { name: "Classy Touch Single Electric Hot Plate – White", price: 59999, image: "https:/" },
  { name: "Anskin" },
  { name: "Neocell Marine Collagen Plus Hyaluronic Acid Capsules, 120 Count", price: 220000, image: "htt
  { " },
  {},
  { name: "Movit Hair Shampoo Strawberry - 1L NeW", price: 3" },
  { name: "Parach
  { name: "RENA Mpirivuma Seed Coffee- 250g", price: 59999, image: "https://ug.jumia.is/unsafe/fit-in/30
  { 276" },
  { },
  { name: "Original 2.0 Litre Large Electric Kettle Percolat7" },
  { name: "U-Shap?9668" },
  { name: "RENA Okra Seed Coffee 250g (Very Good For Women Water)", price: 69999, image: "https://ug.jum?6830" },
  { 49" },
  {" },
  { name: "A Class Version Original Herbal Male Manhood S
  { name: "Lanben
  { name: "Fruit Of The Wokali Hydrating Sooth Skin Toner 400ml", price: 55000, image: "https://ug.jumi},
  {?6005" }
];

async function addProduct(product, index) {
  const sku = `JUM${String(index + 1).padStart(3, '0')}`;
  
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
      console.log(`✓ Added: ${productData.name} (${sku})`);
    } else {
      console.log(`✗ Failed to add: ${productData.name}`);
    }
  } catch (error) {
    console.log(`✗ Error adding ${productData.name}: ${error.message}`);
  }
}

async function addAllProducts() {
  console.log('Adding products to inventory...');
  
  for (let i = 0; i < products.length; i++) {
    await addProduct(products[i], i);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
  }
  
  console.log('Done! All products added with 0 stock.');
}

addAllProducts();