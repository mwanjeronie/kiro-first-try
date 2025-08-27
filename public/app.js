// Global state
let products = [];
let categories = [];
let suppliers = [];
let movements = [];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadInitialData();
    // Apply default filter after data loads
    setTimeout(() => {
        filterProducts();
    }, 1000);
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
        section.classList.add('hidden');
        section.classList.remove('block');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active', 'border-blue-500', 'text-blue-600');
        item.classList.add('border-transparent', 'text-gray-500');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden');
    targetSection.classList.add('block');
    
    // Add active class to clicked nav item
    const clickedItem = event.target.closest('.nav-item');
    clickedItem.classList.add('active', 'border-blue-500', 'text-blue-600');
    clickedItem.classList.remove('border-transparent', 'text-gray-500');
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
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exchange-alt text-gray-400"></i>
                </div>
                <p class="text-gray-500">No recent movements</p>
                <p class="text-sm text-gray-400 mt-1">Stock movements will appear here</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-3">
            ${recentMovements.map(movement => {
                const isStockIn = movement.movement_type === 'IN';
                const quantityColor = isStockIn ? 'text-green-600' : 'text-red-600';
                const quantityBg = isStockIn ? 'bg-green-50' : 'bg-red-50';
                
                return `
                    <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div class="flex items-center space-x-3 flex-1 min-w-0">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 ${quantityBg} rounded-lg flex items-center justify-center">
                                    <i class="fas fa-${isStockIn ? 'arrow-up' : 'arrow-down'} ${quantityColor} text-xs"></i>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">${movement.product_name}</p>
                                <div class="flex items-center space-x-2 text-xs text-gray-500">
                                    <span class="bg-gray-100 px-1.5 py-0.5 rounded">${movement.sku}</span>
                                    ${movement.reference ? `<span>• ${movement.reference}</span>` : ''}
                                    <span>• ${new Date(movement.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex-shrink-0 ml-3">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${quantityBg} ${quantityColor}">
                                ${isStockIn ? '+' : '-'}${movement.quantity}
                            </span>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Products rendering
function renderProducts() {
    const container = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-12"><p class="text-gray-500 text-lg">No products found</p></div>';
        return;
    }
    
    container.innerHTML = products.map(product => {
        const stockStatus = getStockStatus(product.stock_quantity, product.min_stock);
        const imageHtml = product.image_url 
            ? `<img src="${product.image_url}" alt="${product.name}" class="w-full aspect-square object-cover" onerror="this.parentElement.innerHTML='<div class=\\'w-full aspect-square bg-gray-100 flex items-center justify-center\\'>  <i class=\\'fas fa-image text-gray-400 text-2xl\\'></i></div>'">`
            : '<div class="w-full aspect-square bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300"><i class="fas fa-image text-gray-400 text-2xl"></i></div>';
        
        const statusColors = {
            'in-stock': 'bg-green-100 text-green-800',
            'low-stock': 'bg-yellow-100 text-yellow-800', 
            'out-of-stock': 'bg-red-100 text-red-800'
        };
        
        return `
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div class="w-full">
                    ${imageHtml}
                </div>
                <div class="p-3">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex-1 min-w-0">
                            <h3 class="text-sm font-medium text-gray-900 truncate">${product.name}</h3>
                            <p class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">${product.sku}</p>
                        </div>
                        <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[stockStatus.class] || 'bg-gray-100 text-gray-800'} ml-2">
                            ${stockStatus.text}
                        </span>
                    </div>
                    
                    <div class="bg-gray-50 rounded p-2 mb-3 text-center">
                        <div class="text-xs text-gray-500">Current Stock</div>
                        <div class="text-lg font-semibold text-gray-900">${product.stock_quantity || 0}</div>
                    </div>
                    
                    <button onclick="quickStockAdjust(${product.id}, '${product.name}')" class="w-full inline-flex items-center justify-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                        <i class="fas fa-edit mr-2"></i>
                        Adjust Stock
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
    const availableOnly = document.getElementById('availableOnlyFilter').checked;
    
    let filteredProducts = products.filter(product => {
        // Search filter
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            (product.category_name && product.category_name.toLowerCase().includes(searchTerm));
        
        // Available stock filter
        const hasStock = availableOnly ? (product.stock_quantity > 0) : true;
        
        return matchesSearch && hasStock;
    });
    
    const container = document.getElementById('productsGrid');
    
    if (filteredProducts.length === 0) {
        const message = availableOnly ? 
            'No available products found matching your search' : 
            'No products found matching your search';
        container.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i class="fas fa-search text-gray-400 text-xl"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
                <p class="text-gray-500 max-w-sm">${message}</p>
                ${availableOnly ? `
                    <button onclick="document.getElementById('availableOnlyFilter').checked = false; filterProducts();" class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <i class="fas fa-eye mr-2"></i>
                        Show All Products
                    </button>
                ` : ''}
            </div>
        `;
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
        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">No products found</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => {
        const stockStatus = getStockStatus(product.stock_quantity, product.min_stock);
        
        const statusColors = {
            'in-stock': 'bg-green-100 text-green-800',
            'low-stock': 'bg-yellow-100 text-yellow-800', 
            'out-of-stock': 'bg-red-100 text-red-800'
        };
        
        return `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <span class="bg-gray-100 px-2 py-1 rounded text-xs">${product.sku}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div class="font-medium">${product.name}</div>
                    ${product.category_name ? `<div class="text-xs text-gray-500">${product.category_name}</div>` : ''}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span class="font-semibold text-lg">${product.stock_quantity || 0}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[stockStatus.class] || 'bg-gray-100 text-gray-800'}">
                        ${stockStatus.text}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="quickStockAdjust(${product.id}, '${product.name}')" class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs leading-4 font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200">
                        <i class="fas fa-edit mr-1"></i>
                        Adjust
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
        container.innerHTML = `
            <div class="p-6 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-exchange-alt text-gray-400 text-xl"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No Movements Found</h3>
                <p class="text-gray-500">Stock movements will appear here once you start adjusting inventory.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = movements.map(movement => {
        const isStockIn = movement.movement_type === 'IN';
        const quantityColor = isStockIn ? 'text-green-600' : 'text-red-600';
        const quantityBg = isStockIn ? 'bg-green-50' : 'bg-red-50';
        
        return `
            <div class="px-6 py-4 hover:bg-gray-50 transition-colors duration-200">
                <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 ${quantityBg} rounded-lg flex items-center justify-center">
                                    <i class="fas fa-${isStockIn ? 'arrow-up' : 'arrow-down'} ${quantityColor}"></i>
                                </div>
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">
                                    ${movement.product_name}
                                </p>
                                <div class="flex items-center space-x-2 text-xs text-gray-500">
                                    <span class="bg-gray-100 px-2 py-0.5 rounded">${movement.sku}</span>
                                    ${movement.reference ? `<span>• ${movement.reference}</span>` : ''}
                                    <span>• ${new Date(movement.created_at).toLocaleDateString()}</span>
                                </div>
                                ${movement.notes ? `<p class="text-xs text-gray-600 mt-1">${movement.notes}</p>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="flex-shrink-0 ml-4">
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${quantityBg} ${quantityColor}">
                            ${isStockIn ? '+' : '-'}${movement.quantity}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Categories and suppliers rendering
function renderCategories() {
    const container = document.getElementById('categoriesList');
    
    if (categories.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-tags text-gray-400"></i>
                </div>
                <p class="text-gray-500">No categories found</p>
                <p class="text-sm text-gray-400 mt-1">Add categories to organize your products</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-3">
            ${categories.map(category => `
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <h4 class="text-sm font-medium text-gray-900">${category.name}</h4>
                    ${category.description ? `<p class="text-sm text-gray-600 mt-1">${category.description}</p>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}

function renderSuppliers() {
    const container = document.getElementById('suppliersList');
    
    if (suppliers.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8">
                <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fas fa-truck text-gray-400"></i>
                </div>
                <p class="text-gray-500">No suppliers found</p>
                <p class="text-sm text-gray-400 mt-1">Add suppliers to track product sources</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="space-y-3">
            ${suppliers.map(supplier => `
                <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <h4 class="text-sm font-medium text-gray-900">${supplier.name}</h4>
                    <div class="mt-2 space-y-1">
                        ${supplier.contact_person ? `<p class="text-xs text-gray-600"><span class="font-medium">Contact:</span> ${supplier.contact_person}</p>` : ''}
                        ${supplier.email ? `<p class="text-xs text-gray-600"><span class="font-medium">Email:</span> ${supplier.email}</p>` : ''}
                        ${supplier.phone ? `<p class="text-xs text-gray-600"><span class="font-medium">Phone:</span> ${supplier.phone}</p>` : ''}
                        ${supplier.address ? `<p class="text-xs text-gray-600"><span class="font-medium">Address:</span> ${supplier.address}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
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