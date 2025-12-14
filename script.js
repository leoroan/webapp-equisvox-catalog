// ===== CONFIGURACIÓN GLOBAL =====
const CONFIG = {
    itemsPerPage: 12,
    currentPage: 1,
    currentProducts: [],
    filteredProducts: [],
    categories: {
        'tech': ['Smartphone', 'Laptop', 'Tablet', 'Headphones', 'Webcam', 'Speaker', 'Earbuds', 'Projector'],
        'gaming': ['Gaming', 'RGB', 'Controller', 'Mouse', 'Keyboard', 'Monitor'],
        'home': ['Watch', 'Camera', 'Scale', 'Purifier', 'Thermostat', 'Coffee', 'Vacuum', 'Lamp', 'Doorbell', 'Garden'],
        'office': ['Office', 'Chair', 'SSD', 'Charger']
    }
};

// ===== CLASE PARA MANEJO DE PRODUCTOS =====
class ProductManager {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.setupEventListeners();
            this.renderProducts();
            this.setupPagination();
        } catch (error) {
            console.error('Error al inicializar:', error);
            this.showError('Error al cargar los productos');
        }
    }

    // Cargar productos desde CSV
    async loadProducts() {
        try {
            const response = await fetch('sample_data.csv');
            const csvText = await response.text();

            // Parsear CSV manualmente
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(',');
            
            this.products = lines.slice(1).map(line => {
                const values = this.parseCSVLine(line);
                const product = {};
                headers.forEach((header, index) => {
                    product[header.trim()] = values[index] ? values[index].trim() : '';
                });
                
                // Convertir tipos de datos
                product['Original Price'] = parseFloat(product['Original Price']) || 0;
                product['Current Price'] = parseFloat(product['Current Price']) || 0;
                product['Discount %'] = parseFloat(product['Discount %']) || 0;
                product['ID'] = parseInt(product['ID']) || 0;
                
                return product;
            });

            CONFIG.currentProducts = [...this.products];
            CONFIG.filteredProducts = [...this.products];
            
            console.log(`Productos cargados: ${this.products.length}`);
            
        } catch (error) {
            console.error('Error al cargar CSV:', error);
            // Cargar datos de respaldo
            this.loadFallbackData();
        }
    }

    // Parsear línea CSV (maneja comillas)
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    // Datos de respaldo si falla el CSV
    loadFallbackData() {
        const fallbackProducts = [
            {
                "ID": 1,
                "Title": "Smartphone Samsung Galaxy S24",
                "Original Price": 899.99,
                "Current Price": 749.99,
                "Discount %": 16.67,
                "Offer": "Free Shipping",
                "URL": "https://example.com/product1"
            },
            {
                "ID": 2,
                "Title": "Laptop Gaming RGB Pro",
                "Original Price": 1299.99,
                "Current Price": 999.99,
                "Discount %": 23.08,
                "Offer": "Bundle Deal",
                "URL": "https://example.com/product2"
            },
            {
                "ID": 3,
                "Title": "Wireless Headphones Pro Max",
                "Original Price": 299.99,
                "Current Price": 199.99,
                "Discount %": 33.33,
                "Offer": "Limited Time",
                "URL": "https://example.com/product3"
            }
        ];

        this.products = fallbackProducts;
        CONFIG.currentProducts = [...this.products];
        CONFIG.filteredProducts = [...this.products];
    }

    // Configurar event listeners
    setupEventListeners() {
        // Filtros
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortProducts(e.target.value);
        });

        document.getElementById('categorySelect').addEventListener('change', (e) => {
            this.filterByCategory(e.target.value);
        });

        document.getElementById('priceRange').addEventListener('change', (e) => {
            this.filterByPrice(e.target.value);
        });

        document.getElementById('discountFilter').addEventListener('change', (e) => {
            this.filterByDiscount(e.target.value);
        });

        // Búsqueda
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });

        // Limpiar búsqueda al hacer clic en la X del navegador
        searchInput.addEventListener('search', (e) => {
            if (e.target.value === '') {
                this.searchProducts('');
            }
        });
    }

    // Renderizar productos
    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const spinner = document.getElementById('loadingSpinner');
        const noResults = document.getElementById('noResults');

        // Ocultar spinner
        spinner.style.display = 'none';

        // Limpiar grid
        grid.innerHTML = '';

        if (CONFIG.filteredProducts.length === 0) {
            grid.style.display = 'none';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        grid.style.display = 'flex';

        // Calcular paginación
        const startIndex = (CONFIG.currentPage - 1) * CONFIG.itemsPerPage;
        const endIndex = startIndex + CONFIG.itemsPerPage;
        const productsToShow = CONFIG.filteredProducts.slice(startIndex, endIndex);

        // Renderizar productos
        productsToShow.forEach((product, index) => {
            const productCard = this.createProductCard(product);
            grid.appendChild(productCard);

            // Animar entrada
            setTimeout(() => {
                productCard.classList.add('animate__animated', 'animate__fadeInUp');
            }, index * 100);
        });

        // Actualizar paginación
        this.updatePagination();
    }

    // Crear card de producto
    createProductCard(product) {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6 col-12';

        const discountPercent = Math.round(product['Discount %']);
        const savings = (product['Original Price'] - product['Current Price']).toFixed(2);

        col.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <div class="discount-badge">
                        -${discountPercent}%
                    </div>
                    <img src="${product['Image URL']}" alt="${product['Title']}" style="max-width: 100%; height: auto;">
                    <i class="fas fa-box-open"></i>
                    
                </div>
                <div class="product-info">
                    <h5 class="product-title">${product.Title}</h5>
                    <div class="product-offer">${product.Offer}</div>
                    <div class="price-container">
                        <span class="original-price">$${product['Original Price'].toFixed(2)}</span>
                        <span class="current-price">$${product['Current Price'].toFixed(2)}</span>
                    </div>
                    <div class="text-success small mb-3">
                        <i class="fas fa-tag me-1"></i>
                        Ahorras $${savings}
                    </div>
                    <div class="product-actions">
                        <a href="${product.URL}" target="_blank" class="btn-view">
                            <i class="fas fa-external-link-alt me-2"></i>Ver Producto
                        </a>
                        <button class="btn-cart" onclick="addToCart(${product.ID})" title="Agregar al carrito">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    // Ordenar productos
    sortProducts(sortType) {
        switch (sortType) {
            case 'price-low':
                CONFIG.filteredProducts.sort((a, b) => a['Current Price'] - b['Current Price']);
                break;
            case 'price-high':
                CONFIG.filteredProducts.sort((a, b) => b['Current Price'] - a['Current Price']);
                break;
            case 'discount':
                CONFIG.filteredProducts.sort((a, b) => b['Discount %'] - a['Discount %']);
                break;
            case 'title':
                CONFIG.filteredProducts.sort((a, b) => a.Title.localeCompare(b.Title));
                break;
            default:
                CONFIG.filteredProducts = [...CONFIG.currentProducts];
        }

        CONFIG.currentPage = 1;
        this.renderProducts();
    }

    // Filtrar por categoría
    filterByCategory(category) {
        if (category === 'all') {
            CONFIG.filteredProducts = [...CONFIG.currentProducts];
        } else {
            const categoryKeywords = CONFIG.categories[category] || [];
            CONFIG.filteredProducts = CONFIG.currentProducts.filter(product => {
                return categoryKeywords.some(keyword => 
                    product.Title.toLowerCase().includes(keyword.toLowerCase())
                );
            });
        }

        CONFIG.currentPage = 1;
        this.renderProducts();
    }

    // Filtrar por rango de precio
    filterByPrice(range) {
        let filtered = [...CONFIG.currentProducts];

        if (range !== 'all') {
            filtered = filtered.filter(product => {
                const price = product['Current Price'];
                switch (range) {
                    case '0-100':
                        return price >= 0 && price <= 100;
                    case '100-300':
                        return price > 100 && price <= 300;
                    case '300-600':
                        return price > 300 && price <= 600;
                    case '600+':
                        return price > 600;
                    default:
                        return true;
                }
            });
        }

        CONFIG.filteredProducts = filtered;
        CONFIG.currentPage = 1;
        this.renderProducts();
    }

    // Filtrar por descuento
    filterByDiscount(discount) {
        let filtered = [...CONFIG.currentProducts];

        if (discount !== 'all') {
            filtered = filtered.filter(product => {
                const discountPercent = product['Discount %'];
                switch (discount) {
                    case '20+':
                        return discountPercent >= 20;
                    case '25+':
                        return discountPercent >= 25;
                    case '30+':
                        return discountPercent >= 30;
                    default:
                        return true;
                }
            });
        }

        CONFIG.filteredProducts = filtered;
        CONFIG.currentPage = 1;
        this.renderProducts();
    }

    // Buscar productos
    searchProducts(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            CONFIG.filteredProducts = [...CONFIG.currentProducts];
        } else {
            CONFIG.filteredProducts = CONFIG.currentProducts.filter(product => {
                return product.Title.toLowerCase().includes(searchTerm) ||
                       product.Offer.toLowerCase().includes(searchTerm);
            });
        }

        CONFIG.currentPage = 1;
        this.renderProducts();
    }

    // Configurar paginación
    setupPagination() {
        this.updatePagination();
    }

    // Actualizar paginación
    updatePagination() {
        const pagination = document.getElementById('pagination');
        const totalPages = Math.ceil(CONFIG.filteredProducts.length / CONFIG.itemsPerPage);
        
        pagination.innerHTML = '';

        if (totalPages <= 1) {
            return;
        }

        // Botón anterior
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${CONFIG.currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" data-page="${CONFIG.currentPage - 1}">Anterior</a>`;
        pagination.appendChild(prevLi);

        // Números de página
        const maxVisiblePages = 5;
        let startPage = Math.max(1, CONFIG.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === CONFIG.currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#" data-page="${i}">${i}</a>`;
            pagination.appendChild(li);
        }

        // Botón siguiente
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${CONFIG.currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#" data-page="${CONFIG.currentPage + 1}">Siguiente</a>`;
        pagination.appendChild(nextLi);

        // Event listeners
        pagination.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(e.target.dataset.page);
            if (page && page !== CONFIG.currentPage && page > 0 && page <= totalPages) {
                CONFIG.currentPage = page;
                this.renderProducts();
                this.scrollToTop();
            }
        });
    }

    // Scroll hacia arriba
    scrollToTop() {
        document.getElementById('catalog').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Mostrar error
    showError(message) {
        const grid = document.getElementById('productsGrid');
        const spinner = document.getElementById('loadingSpinner');
        
        spinner.style.display = 'none';
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h4 class="text-danger">Error</h4>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-redo me-2"></i>Reintentar
                </button>
            </div>
        `;
        grid.style.display = 'flex';
    }
}

// ===== FUNCIONES GLOBALES =====

// Scroll al catálogo
function scrollToCatalog() {
    document.getElementById('catalog').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Agregar al carrito
function addToCart(productId) {
    // Animación de feedback
    const button = event.target.closest('.btn-cart');
    const originalContent = button.innerHTML;
    
    button.innerHTML = '<i class="fas fa-check"></i>';
    button.style.background = 'var(--success-color)';
    button.style.color = 'white';
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.background = '';
        button.style.color = '';
    }, 1500);
    
    // Mostrar notificación
    showNotification('Producto agregado al carrito', 'success');
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'info' ? 'primary' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: var(--shadow-lg);
        border: none;
        border-radius: var(--border-radius);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// ===== INICIALIZACIÓN =====

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Ocultar spinner después de un tiempo máximo
    setTimeout(() => {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner.style.display !== 'none') {
            spinner.style.display = 'none';
        }
    }, 5000);
    
    // Inicializar gestor de productos
    window.productManager = new ProductManager();
});

// Smooth scrolling para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(31, 41, 55, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(31, 41, 55, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Prevenir comportamiento por defecto de botones disabled
document.addEventListener('click', (e) => {
    if (e.target.closest('.disabled')) {
        e.preventDefault();
    }
});
