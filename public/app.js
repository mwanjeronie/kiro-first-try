// Global state
let products = [];
let categories = [];
let suppliers = [];
let movements = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadInitialData();
});

// API Helper functions
async function apiCall(endpoint, options = {}) {
    showLoading();
    try {
        const response = await fetch(`/api${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        showToast('API call failed: ' + error.message, 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Load initial data
async function loadInitialData() {
    try {
        await Promise.all([
            loadProducts(),
            loadCategories(),
            loadSuppliers(),
            loadMovements(),
            loadDashboardStats()
        ]);
    } catch (error) {
        console.error('Failed to load initial data:', error);
    }
}

// Data loading functions
async function loadProducts() {
    try {
        products = await apiCall('/products');
        renderProducts();
        renderStockTable();
        populateProductSelects();
    } catch (error) {
        console.error('Failed to load products:', error);
    }
}

async function loadCategories() {
    try {
        categories = await apiCall('/categories');
        renderCategories();
        populateCategorySelect();
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

async function loadSuppliers() {
    try {
        suppliers = await apiCall('/suppliers');
        renderSuppliers();
        populateSupplierSelect();
    } catch (error) {
        console.error('Failed to load suppliers:', error);
    }
}

async function loadMovements() {
    try {
        movements = await apiCall('/movements');
        renderMovements();
        renderRecentMovements();
    } catch (error) {
        console.error('Failed to load movements:', error);
    }
}

async function loadDashboardStats() {
    try {
        const stats = await apiCall('/dashboard/stats');
        updateDashboardStats(stats);
    } catch (error) {
        console.error('Failed to load dashboard stats:', error);
    }
}

// Navigation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Add active class to clicked nav item
    event.target.closest('.nav-item').classList.add('active');
}

// Dashboard rendering
function updateDashboardStats(stats) {
    document.getElementById('totalProducts').textContent = stats.totalProducts || 0;
    document.getElementById('lowStockItems').textContent = stats.lowStockItems || 0;
    document.getElementById('totalItems').textContent = stats.totalItems || 0;
}

function renderRecentMovements() {
    const container = document.getElementById('recentMovements');
    const recentMovements = movements.slice(0, 5);
    
    if (recentMovements.length === 0) {
        container.innerHTML = '<p class="text-muted">No recent movements</p>';
        return;
    }
    
    container.innerHTML = recentMovements.map(movement => `
        <div class="movement-item">
            <div class="movement-info">
                <div class="movement-product">${movement.product_name} (${movement.sku})</div>
                <div class="movement-details">
                    ${movement.reference ? movement.reference + ' • ' : ''}
                    ${new Date(movement.created_at).toLocaleDateString()}
                </div>
            </div>
            <div class="movement-quantity ${movement.movement_type.toLowerCase()}">
                ${movement.movement_type === 'IN' ? '+' : '-'}${movement.quantity}
            </div>
        </div>
    `).join('');
}

// Products rendering
function renderProducts() {
    const container = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        container.innerHTML = '<p class="text-muted">No products found</p>';
        return;
    }
    
    container.innerHTML = products.map(product => {
        const stockStatus = getStockStatus(product.stock_quantity, product.min_stock);
        const imageHtml = product.image_url 
            ? `<img src="${product.image_url}" alt="${product.name}" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-image\\'></i>'">`
            : '<i class="fas fa-image"></i>';
        
        return `
            <div class="product-card">
                <div class="product-image ${!product.image_url ? 'no-image' : ''}">
                    ${imageHtml}
                </div>
                <div class="product-header">
                    <div>
                        <div class="product-title">${product.name}</div>
                        <div class="product-sku">${product.sku}</div>
                    </div>
                    <div class="stock-status ${stockStatus.class}">${stockStatus.text}</div>
                </div>
                <div class="product-info">
                    ${product.description ? `<p>${product.description}</p>` : ''}
                    ${product.category_name ? `<p><strong>Category:</strong> ${product.category_name}</p>` : ''}
                    ${product.supplier_name ? `<p><strong>Supplier:</strong> ${product.supplier_name}</p>` : ''}
                </div>
                <div class="product-stock">
                    <div class="stock-info">
                        <div class="label">Current Stock</div>
                        <div class="value">${product.stock_quantity || 0}</div>
                    </div>
                    <div class="stock-info">
                        <div class="label">Min Stock</div>
                        <div class="value">${product.min_stock || 0}</div>
                    </div>
                    <div class="stock-info">
                        <div class="label">Max Stock</div>
                        <div class="value">${product.max_stock || 0}</div>
                    </div>
                </div>
                <div class="product-actions">
                    <button class="btn btn-sm btn-primary" onclick="quickStockAdjust(${product.id}, '${product.name}')">
                        <i class="fas fa-edit"></i> Adjust Stock
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function getStockStatus(currentStock, minStock) {
    if (currentStock === 0) {
        return { class: 'out-of-stock', text: 'Out of Stock' };
    } else if (currentStock <= minStock) {
        return { class: 'low-stock', text: 'Low Stock' };
    } else {
        return { class: 'in-stock', text: 'In Stock' };
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        (product.category_name && product.category_name.toLowerCase().includes(searchTerm))
    );
    
    const container = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p class="text-muted">No products found matching your search</p>';
        return;
    }
    
    // Re-render with filtered products
    const originalProducts = products;
    products = filteredProducts;
    renderProducts();
    products = originalProducts;
}

// Stock table rendering
function renderStockTable() {
    const tbody = document.getElementById('stockTableBody');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No products found</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => {
        const stockStatus = getStockStatus(product.stock_quantity, product.min_stock);
        return `
            <tr>
                <td>${product.sku}</td>
                <td>${product.name}</td>
                <td>${product.stock_quantity || 0}</td>
                <td>${product.min_stock || 0}</td>
                <td><span class="stock-status ${stockStatus.class}">${stockStatus.text}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="quickStockAdjust(${product.id}, '${product.name}')">
                        <i class="fas fa-edit"></i> Adjust
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Movements rendering
function renderMovements() {
    const container = document.getElementById('movementsList');
    
    if (movements.length === 0) {
        container.innerHTML = '<p class="text-muted">No stock movements found</p>';
        return;
    }
    
    container.innerHTML = movements.map(movement => `
        <div class="movement-item">
            <div class="movement-info">
                <div class="movement-product">${movement.product_name} (${movement.sku})</div>
                <div class="movement-details">
                    ${movement.reference ? movement.reference + ' • ' : ''}
                    ${movement.notes ? movement.notes + ' • ' : ''}
                    ${new Date(movement.created_at).toLocaleString()}
                </div>
            </div>
            <div class="movement-quantity ${movement.movement_type.toLowerCase()}">
                ${movement.movement_type === 'IN' ? '+' : '-'}${movement.quantity}
            </div>
        </div>
    `).join('');
}

// Categories and suppliers rendering
function renderCategories() {
    const container = document.getElementById('categoriesList');
    
    if (categories.length === 0) {
        container.innerHTML = '<p class="text-muted">No categories found</p>';
        return;
    }
    
    container.innerHTML = categories.map(category => `
        <div class="list-item">
            <h4>${category.name}</h4>
            ${category.description ? `<p>${category.description}</p>` : ''}
        </div>
    `).join('');
}

function renderSuppliers() {
    const container = document.getElementById('suppliersList');
    
    if (suppliers.length === 0) {
        container.innerHTML = '<p class="text-muted">No suppliers found</p>';
        return;
    }
    
    container.innerHTML = suppliers.map(supplier => `
        <div class="list-item">
            <h4>${supplier.name}</h4>
            ${supplier.contact_person ? `<p><strong>Contact:</strong> ${supplier.contact_person}</p>` : ''}
            ${supplier.email ? `<p><strong>Email:</strong> ${supplier.email}</p>` : ''}
            ${supplier.phone ? `<p><strong>Phone:</strong> ${supplier.phone}</p>` : ''}
        </div>
    `).join('');
}

// Populate select dropdowns
function populateProductSelects() {
    const select = document.getElementById('adjustProduct');
    select.innerHTML = '<option value="">Select Product</option>' +
        products.map(product => `<option value="${product.id}">${product.name} (${product.sku})</option>`).join('');
}

function populateCategorySelect() {
    const select = document.getElementById('productCategory');
    select.innerHTML = '<option value="">Select Category</option>' +
        categories.map(category => `<option value="${category.id}">${category.name}</option>`).join('');
}

function populateSupplierSelect() {
    const select = document.getElementById('productSupplier');
    select.innerHTML = '<option value="">Select Supplier</option>' +
        suppliers.map(supplier => `<option value="${supplier.id}">${supplier.name}</option>`).join('');
}

// Modal functions
function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    // Reset form if exists
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
}

function showAddProductModal() {
    showModal('addProductModal');
}

function showStockAdjustModal() {
    showModal('stockAdjustModal');
}

function showAddCategoryModal() {
    showModal('addCategoryModal');
}

function showAddSupplierModal() {
    showModal('addSupplierModal');
}

function showBulkImportModal() {
    showModal('bulkImportModal');
}

function quickStockAdjust(productId, productName) {
    document.getElementById('adjustProduct').value = productId;
    showStockAdjustModal();
}

// Form submissions
async function addProduct(event) {
    event.preventDefault();
    
    const formData = {
        sku: document.getElementById('productSku').value,
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        image_url: document.getElementById('productImageUrl').value || null,
        category_id: document.getElementById('productCategory').value || null,
        supplier_id: document.getElementById('productSupplier').value || null,
        min_stock: parseInt(document.getElementById('productMinStock').value) || 0,
        max_stock: parseInt(document.getElementById('productMaxStock').value) || 1000
    };
    
    try {
        await apiCall('/products', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        closeModal('addProductModal');
        showToast('Product added successfully!');
        await loadProducts();
        await loadDashboardStats();
    } catch (error) {
        console.error('Failed to add product:', error);
    }
}

async function adjustStock(event) {
    event.preventDefault();
    
    const formData = {
        product_id: parseInt(document.getElementById('adjustProduct').value),
        quantity: parseInt(document.getElementById('adjustQuantity').value),
        movement_type: document.getElementById('adjustmentType').value,
        reference: document.getElementById('adjustReference').value,
        notes: document.getElementById('adjustNotes').value
    };
    
    try {
        await apiCall('/stock/adjust', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        closeModal('stockAdjustModal');
        showToast('Stock adjusted successfully!');
        await Promise.all([
            loadProducts(),
            loadMovements(),
            loadDashboardStats()
        ]);
    } catch (error) {
        console.error('Failed to adjust stock:', error);
    }
}

async function addCategory(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('categoryName').value,
        description: document.getElementById('categoryDescription').value
    };
    
    try {
        await apiCall('/categories', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        closeModal('addCategoryModal');
        showToast('Category added successfully!');
        await loadCategories();
    } catch (error) {
        console.error('Failed to add category:', error);
    }
}

async function addSupplier(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('supplierName').value,
        contact_person: document.getElementById('supplierContact').value,
        email: document.getElementById('supplierEmail').value,
        phone: document.getElementById('supplierPhone').value,
        address: document.getElementById('supplierAddress').value
    };
    
    try {
        await apiCall('/suppliers', {
            method: 'POST',
            body: JSON.stringify(formData)
        });
        
        closeModal('addSupplierModal');
        showToast('Supplier added successfully!');
        await loadSuppliers();
    } catch (error) {
        console.error('Failed to add supplier:', error);
    }
}

// Utility functions
function showLoading() {
    document.getElementById('loadingSpinner').classList.add('show');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.remove('show');
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('show');
    }
});

// Handle escape key to close modals
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            modal.classList.remove('show');
        });
    }
});

// Image preview function
function previewProductImage() {
    const imageUrl = document.getElementById('productImageUrl').value;
    const previewContainer = document.getElementById('imagePreview');
    
    if (!imageUrl) {
        previewContainer.classList.remove('show');
        previewContainer.innerHTML = '';
        return;
    }
    
    // Validate URL format
    try {
        new URL(imageUrl);
    } catch (e) {
        previewContainer.classList.add('show');
        previewContainer.innerHTML = '<div class="preview-error">Invalid URL format</div>';
        return;
    }
    
    // Create image element to test if it loads
    const img = new Image();
    
    img.onload = function() {
        previewContainer.classList.add('show');
        previewContainer.innerHTML = `<img src="${imageUrl}" alt="Product preview">`;
    };
    
    img.onerror = function() {
        previewContainer.classList.add('show');
        previewContainer.innerHTML = '<div class="preview-error">Unable to load image from this URL</div>';
    };
    
    img.src = imageUrl;
}

// Clear image preview when modal closes
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
    // Reset form if exists
    const form = document.querySelector(`#${modalId} form`);
    if (form) {
        form.reset();
        // Clear image preview
        if (modalId === 'addProductModal') {
            const previewContainer = document.getElementById('imagePreview');
            previewContainer.classList.remove('show');
            previewContainer.innerHTML = '';
        }
    }
}

// Bulk import functions
function switchImportTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update sections
    document.querySelectorAll('.import-section').forEach(section => section.classList.remove('active'));
    document.getElementById(tabName === 'json' ? 'jsonImport' : 'templateImport').classList.add('active');
}

function generateSataTemplate() {
    // Generate template for SATA Uganda products
    const sataProducts = [];
    
    // Sample SATA Uganda product categories
    const categories = [
        'Hard Drives', 'SSDs', 'Memory Cards', 'USB Drives', 'External Storage',
        'Cables & Adapters', 'Power Supplies', 'Cooling Fans', 'Motherboards',
        'Graphics Cards', 'RAM Memory', 'Processors', 'Network Cards', 'Sound Cards'
    ];
    
    const brands = ['Samsung', 'Western Digital', 'Seagate', 'Kingston', 'SanDisk', 'Corsair', 'ASUS', 'MSI', 'Gigabyte', 'Intel', 'AMD'];
    
    // Generate 279 products
    for (let i = 1; i <= 279; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const capacity = ['128GB', '256GB', '512GB', '1TB', '2TB', '4TB', '8TB'][Math.floor(Math.random() * 7)];
        
        let productName, basePrice;
        
        switch (category) {
            case 'Hard Drives':
                productName = `${brand} ${capacity} SATA Hard Drive`;
                basePrice = Math.floor(Math.random() * 200) + 50;
                break;
            case 'SSDs':
                productName = `${brand} ${capacity} SSD`;
                basePrice = Math.floor(Math.random() * 300) + 80;
                break;
            case 'Memory Cards':
                productName = `${brand} ${capacity} MicroSD Card`;
                basePrice = Math.floor(Math.random() * 50) + 10;
                break;
            case 'USB Drives':
                productName = `${brand} ${capacity} USB Flash Drive`;
                basePrice = Math.floor(Math.random() * 30) + 5;
                break;
            default:
                productName = `${brand} ${category}`;
                basePrice = Math.floor(Math.random() * 150) + 25;
        }
        
        sataProducts.push({
            sku: `SATA${String(i).padStart(3, '0')}`,
            name: productName,
            description: `High-quality ${category.toLowerCase()} from ${brand}`,
            image_url: `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop&auto=format`,
            category_id: 1, // Electronics category
            supplier_id: 1, // Default supplier
            unit_price: basePrice,
            cost_price: Math.floor(basePrice * 0.7),
            min_stock: 5,
            max_stock: 100,
            initial_stock: 0
        });
    }
    
    document.getElementById('bulkImportData').value = JSON.stringify(sataProducts, null, 2);
    showToast('Generated 279 SATA Uganda products template!');
}

async function processBulkImport() {
    const activeTab = document.querySelector('.import-section.active').id;
    let products = [];
    
    if (activeTab === 'jsonImport') {
        const jsonData = document.getElementById('bulkImportData').value.trim();
        
        if (!jsonData) {
            showToast('Please enter JSON data', 'error');
            return;
        }
        
        try {
            products = JSON.parse(jsonData);
            if (!Array.isArray(products)) {
                throw new Error('Data must be an array of products');
            }
        } catch (error) {
            showToast('Invalid JSON format: ' + error.message, 'error');
            return;
        }
    } else {
        showToast('CSV import not implemented yet', 'warning');
        return;
    }
    
    if (products.length === 0) {
        showToast('No products to import', 'warning');
        return;
    }
    
    try {
        const result = await apiCall('/products/bulk', {
            method: 'POST',
            body: JSON.stringify({ products })
        });
        
        closeModal('bulkImportModal');
        showToast(`Successfully imported ${result.successCount} products!`);
        
        if (result.errorCount > 0) {
            console.log('Import errors:', result.errors);
            showToast(`${result.errorCount} products failed to import`, 'warning');
        }
        
        // Reload data
        await Promise.all([
            loadProducts(),
            loadDashboardStats()
        ]);
        
    } catch (error) {
        console.error('Bulk import failed:', error);
        showToast('Bulk import failed', 'error');
    }
}

function downloadCSVTemplate() {
    const csvContent = `sku,name,description,image_url,unit_price,cost_price,min_stock,initial_stock
PROD001,"Sample Product","Product description","https://example.com/image.jpg",29.99,15.00,5,0
PROD002,"Another Product","Another description","https://example.com/image2.jpg",49.99,25.00,5,0`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        const products = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                const product = {};
                headers.forEach((header, index) => {
                    const key = header.trim().replace(/"/g, '');
                    let value = values[index] ? values[index].trim().replace(/"/g, '') : '';
                    
                    // Convert numeric fields
                    if (['unit_price', 'cost_price'].includes(key)) {
                        value = parseFloat(value) || 0;
                    } else if (['min_stock', 'initial_stock', 'category_id', 'supplier_id'].includes(key)) {
                        value = parseInt(value) || 0;
                    }
                    
                    product[key] = value;
                });
                
                // Set defaults
                product.category_id = product.category_id || 1;
                product.supplier_id = product.supplier_id || 1;
                product.min_stock = product.min_stock || 5;
                product.max_stock = 100;
                product.initial_stock = product.initial_stock || 0;
                
                products.push(product);
            }
        }
        
        // Switch to JSON tab and populate data
        switchImportTab('json');
        document.querySelector('.tab-btn').click();
        document.getElementById('bulkImportData').value = JSON.stringify(products, null, 2);
        showToast(`Loaded ${products.length} products from CSV`);
    };
    
    reader.readAsText(file);
}