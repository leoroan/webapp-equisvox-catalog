// Global variables
let gamesData = [];
let currentPage = 1;
let itemsPerPage = 20;
let filteredData = [];
let searchTerm = '';

// Component loader
async function load(id, file) {
  const el = document.getElementById(id);
  if (!el) return;
  
  el.innerHTML = '<div class="text-center py-3"><div class="spinner-border text-primary"></div></div>';
  
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    el.innerHTML = await response.text();
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
    el.innerHTML = `<div class="alert alert-danger">Error al cargar ${file}</div>`;
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
  await load('header', 'components/header.html');
  await load('footer', 'components/footer.html');
  
  // Check for sample data
  loadSampleData();
});

// Load sample data for demo
function loadSampleData() {
  const sampleData = [
    {
      ID: "1",
      Title: "Cyberpunk 2077",
      "Original Price": "59.99",
      "Current Price": "29.99",
      "Discount %": "50",
      Offer: "Oferta especial - Edición estándar",
      URL: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg"
    },
    {
      ID: "2",
      Title: "The Witcher 3: Wild Hunt",
      "Original Price": "39.99",
      "Current Price": "7.99",
      "Discount %": "80",
      Offer: "Game of the Year Edition",
      URL: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg"
    },
    {
      ID: "3",
      Title: "Red Dead Redemption 2",
      "Original Price": "59.99",
      "Current Price": "35.99",
      "Discount %": "40",
      Offer: "Edición especial con contenido extra",
      URL: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg"
    },
    {
      ID: "4",
      Title: "Hades",
      "Original Price": "24.99",
      "Current Price": "12.49",
      "Discount %": "50",
      Offer: "Roguelike indie del año",
      URL: "https://store.steampowered.com/app/1145360/Hades/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg"
    },
    {
      ID: "5",
      Title: "Elden Ring",
      "Original Price": "59.99",
      "Current Price": "41.99",
      "Discount %": "30",
      Offer: "Juego del año 2022",
      URL: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg"
    },
    {
      ID: "6",
      Title: "God of War",
      "Original Price": "49.99",
      "Current Price": "19.99",
      "Discount %": "60",
      Offer: "PC Port con mejoras visuales",
      URL: "https://store.steampowered.com/app/1593500/God_of_War/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/1593500/header.jpg"
    },
    {
      ID: "7",
      Title: "Hollow Knight",
      "Original Price": "14.99",
      "Current Price": "7.49",
      "Discount %": "50",
      Offer: "Metroidvania indie aclamado",
      URL: "https://store.steampowered.com/app/367520/Hollow_Knight/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg"
    },
    {
      ID: "8",
      Title: "Stardew Valley",
      "Original Price": "14.99",
      "Current Price": "8.99",
      "Discount %": "40",
      Offer: "Simulador de granja indie",
      URL: "https://store.steampowered.com/app/413150/Stardew_Valley/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/413150/header.jpg"
    },
    {
      ID: "9",
      Title: "DOOM Eternal",
      "Original Price": "39.99",
      "Current Price": "15.99",
      "Discount %": "60",
      Offer: "FPS de acción frenética",
      URL: "https://store.steampowered.com/app/782330/DOOM_Eternal/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/782330/header.jpg"
    },
    {
      ID: "10",
      Title: "Celeste",
      "Original Price": "19.99",
      "Current Price": "4.99",
      "Discount %": "75",
      Offer: "Platformer desafiante con historia emotiva",
      URL: "https://store.steampowered.com/app/504230/Celeste/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/504230/header.jpg"
    },
    {
      ID: "11",
      Title: "Portal 2",
      "Original Price": "19.99",
      "Current Price": "4.99",
      "Discount %": "75",
      Offer: "Clásico de Valve - Coop incluido",
      URL: "https://store.steampowered.com/app/620/Portal_2/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/620/header.jpg"
    },
    {
      ID: "12",
      Title: "Half-Life: Alyx",
      "Original Price": "59.99",
      "Current Price": "29.99",
      "Discount %": "50",
      Offer: "VR Game del universo Half-Life",
      URL: "https://store.steampowered.com/app/546560/HalfLife_Alyx/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/546560/header.jpg"
    },
    {
      ID: "13",
      Title: "Sekiro: Shadows Die Twice",
      "Original Price": "59.99",
      "Current Price": "29.99",
      "Discount %": "50",
      Offer: "FromSoftware - Juego del año 2019",
      URL: "https://store.steampowered.com/app/814380/Sekiro_Shadows_Die_Twice/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/814380/header.jpg"
    },
    {
      ID: "14",
      Title: "Outer Wilds",
      "Original Price": "24.99",
      "Current Price": "14.99",
      "Discount %": "40",
      Offer: "Aventura espacial con bucle temporal",
      URL: "https://store.steampowered.com/app/753640/Outer_Wilds/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/753640/header.jpg"
    },
    {
      ID: "15",
      Title: "Disco Elysium",
      "Original Price": "39.99",
      "Current Price": "19.99",
      "Discount %": "50",
      Offer: "RPG narrativo único",
      URL: "https://store.steampowered.com/app/632470/Disco_Elysium/",
      "Image URL": "https://cdn.cloudflare.steamstatic.com/steam/apps/632470/header.jpg"
    }
  ];
  
  gamesData = sampleData;
  filteredData = [...gamesData];
  renderGames();
  showPagination();
}

// CSV Loader
function loadCSV() {
  const fileInput = document.getElementById('csvFile');
  const spinner = document.getElementById('csvSpinner');
  const button = fileInput.nextElementSibling;
  
  if (!fileInput.files[0]) {
    alert('Por favor selecciona un archivo CSV');
    return;
  }
  
  // Show loading state
  button.disabled = true;
  spinner.classList.remove('d-none');
  
  const file = fileInput.files[0];
  const reader = new FileReader();
  
  reader.onload = function(e) {
    try {
      const csv = e.target.result;
      const lines = csv.split('\n');
      const headers = lines[0].split(',');
      const data = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          const row = {};
          headers.forEach((header, index) => {
            row[header.trim()] = values[index] ? values[index].trim() : '';
          });
          data.push(row);
        }
      }
      
      gamesData = data;
      filteredData = [...gamesData];
      currentPage = 1;
      renderGames();
      showPagination();
      
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error al leer el archivo CSV. Por favor verifica el formato.');
    } finally {
      button.disabled = false;
      spinner.classList.add('d-none');
    }
  };
  
  reader.onerror = function() {
    alert('Error al leer el archivo');
    button.disabled = false;
    spinner.classList.add('d-none');
  };
  
  reader.readAsText(file);
}

// Fetch data from URL
async function fetchData() {
  const urlInput = document.getElementById('dataUrl');
  const spinner = document.getElementById('urlSpinner');
  const button = urlInput.nextElementSibling;
  const url = urlInput.value.trim();
  
  if (!url) {
    alert('Por favor ingresa una URL válida');
    return;
  }
  
  // Show loading state
  button.disabled = true;
  spinner.classList.remove('d-none');
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.text();
    
    // Try to parse as CSV
    if (url.includes('.csv') || data.includes(',')) {
      const lines = data.split('\\n');
      const headers = lines[0].split(',');
      const parsedData = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',');
          const row = {};
          headers.forEach((header, index) => {
            row[header.trim()] = values[index] ? values[index].trim() : '';
          });
          parsedData.push(row);
        }
      }
      
      gamesData = parsedData;
    } else {
      // Try to parse as JSON
      const jsonData = JSON.parse(data);
      gamesData = Array.isArray(jsonData) ? jsonData : [jsonData];
    }
    
    filteredData = [...gamesData];
    currentPage = 1;
    renderGames();
    showPagination();
    
  } catch (error) {
    console.error('Error fetching data:', error);
    alert('Error al obtener los datos. Por favor verifica la URL y el formato.');
  } finally {
    button.disabled = false;
    spinner.classList.add('d-none');
  }
}

// Render games grid
function renderGames() {
  const container = document.getElementById('gamesContainer');
  
  if (filteredData.length === 0) {
    container.innerHTML = `
      <div class="text-center py-5">
        <i class="bi bi-inbox" style="font-size: 4rem; color: var(--bs-gray-300);"></i>
        <h3 class="mt-3 text-muted">No se encontraron juegos</h3>
        <p class="text-muted">Intenta cargar diferentes datos o ajusta tu búsqueda</p>
      </div>
    `;
    return;
  }
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pageData = filteredData.slice(startIndex, endIndex);
  
  const gamesHTML = pageData.map(game => createGameCard(game)).join('');
  
  container.innerHTML = `
    <div class="row g-4">
      ${gamesHTML}
    </div>
  `;
}

// Create game card HTML
function createGameCard(game) {
  const title = game.Title || game.title || 'Sin título';
  const originalPrice = parseFloat(game['Original Price'] || game.originalPrice || 0);
  const currentPrice = parseFloat(game['Current Price'] || game.currentPrice || 0);
  const discount = parseInt(game['Discount %'] || game.discount || 0);
  const offer = game.Offer || game.offer || 'Sin descripción';
  const url = game.URL || game.url || '#';
  const imageUrl = game['Image URL'] || game.imageUrl || 'https://via.placeholder.com/300x200?text=Game+Image';
  
  return `
    <div class="col-md-6 col-lg-4 col-xl-3">
      <div class="card game-card">
        <div class="position-relative overflow-hidden">
          <img src="${imageUrl}" 
               alt="Portada de ${title}" 
               loading="lazy"
               onerror="this.src='https://via.placeholder.com/300x200?text=Game+Image'">
          ${discount > 0 ? `<span class="discount-badge position-absolute top-0 end-0 m-2">-${discount}%</span>` : ''}
        </div>
        <div class="card-body">
          <h5 class="game-title">${title}</h5>
          <div class="game-price">
            ${originalPrice > 0 ? `<span class="original-price">$${originalPrice.toFixed(2)}</span>` : ''}
            <span class="current-price">$${currentPrice.toFixed(2)}</span>
          </div>
          <div class="game-offer">${offer}</div>
          <a href="${url}" target="_blank" class="game-url">
            <i class="bi bi-box-arrow-up-right"></i> Ver oferta
          </a>
        </div>
      </div>
    </div>
  `;
}

// Show pagination controls
function showPagination() {
  const paginationSection = document.getElementById('paginationSection');
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  if (totalPages <= 1) {
    paginationSection.style.display = 'none';
    return;
  }
  
  paginationSection.style.display = 'block';
  
  const pagination = document.getElementById('pagination');
  let paginationHTML = '';
  
  // Previous button
  paginationHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="changePage(${currentPage - 1})" aria-label="Previous">
        <span aria-hidden="true">&laquo;</span>
      </a>
    </li>
  `;
  
  // Page numbers
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
      </li>
    `;
  }
  
  // Next button
  paginationHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="changePage(${currentPage + 1})" aria-label="Next">
        <span aria-hidden="true">&raquo;</span>
      </a>
    </li>
  `;
  
  pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderGames();
  showPagination();
  
  // Scroll to top of games
  document.getElementById('gamesContainer').scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}

// Change items per page
function changeItemsPerPage(items) {
  itemsPerPage = items;
  currentPage = 1;
  renderGames();
  showPagination();
}

// Search games
function searchGames(event) {
  event.preventDefault();
  
  const searchInput = document.getElementById('searchInput');
  searchTerm = searchInput.value.toLowerCase().trim();
  
  if (searchTerm === '') {
    filteredData = [...gamesData];
  } else {
    filteredData = gamesData.filter(game => {
      const title = (game.Title || game.title || '').toLowerCase();
      return title.includes(searchTerm);
    });
  }
  
  currentPage = 1;
  renderGames();
  showPagination();
}

// Refresh data
function refreshData() {
  const button = event.target;
  const originalText = button.innerHTML;
  
  button.disabled = true;
  button.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Actualizando...';
  
  setTimeout(() => {
    filteredData = [...gamesData];
    currentPage = 1;
    renderGames();
    showPagination();
    
    button.disabled = false;
    button.innerHTML = originalText;
  }, 1000);
}

// Utility functions
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

function showComingSoon() {
  alert('¡Próximamente! Esta función estará disponible en una futura actualización.');
}

// Export functions for global access
window.loadCSV = loadCSV;
window.fetchData = fetchData;
window.changePage = changePage;
window.changeItemsPerPage = changeItemsPerPage;
window.searchGames = searchGames;
window.refreshData = refreshData;
window.scrollToTop = scrollToTop;
window.showComingSoon = showComingSoon;