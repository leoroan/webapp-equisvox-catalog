// Filters Component
import { AppState } from "./state.js"

export const FiltersComponent = {
    container: null,

    init() {
        this.container = document.getElementById("filtersContainer")
        this.render()
        this.attachEventListeners()
    },

    render() {
        const discountOptions = [
            { value: 0, label: "Cualquiera", icon: "bi-tag" },
            { value: 25, label: "25%+", icon: "bi-tag-fill" },
            { value: 50, label: "50%+", icon: "bi-fire" },
            { value: 75, label: "75%+", icon: "bi-lightning-fill" },
        ]

        this.container.innerHTML = `
            <!-- Search Input -->
            <div class="mb-3">
                <label for="filterTitle" class="form-label fw-semibold">
                    <i class="bi bi-search me-2"></i>Buscar
                </label>
                <input 
                    type="text" 
                    class="form-control" 
                    id="filterTitle" 
                    placeholder="Nombre del juego..."
                >
            </div>

            <!-- Max Price -->
            <div class="mb-3">
                <label for="filterMaxPrice" class="form-label fw-semibold">
                    <i class="bi bi-currency-dollar me-2"></i>Precio máximo
                </label>
                <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input 
                        type="number" 
                        class="form-control" 
                        id="filterMaxPrice" 
                        placeholder="Ej: 5000"
                        min="0"
                        step="100"
                    >
                </div>
            </div>

            <!-- Discount Buttons -->
            <div class="mb-3">
                <label class="form-label fw-semibold">
                    <i class="bi bi-percent me-2"></i>Descuento mínimo
                </label>
                <div class="d-grid gap-2" id="discountButtons">
                    ${discountOptions
                .map(
                    (opt) => `
                        <button 
                            type="button" 
                            class="btn btn-outline-primary btn-sm discount-btn ${opt.value === 0 ? "active" : ""}" 
                            data-value="${opt.value}"
                        >
                            <i class="${opt.icon} me-2"></i>${opt.label}
                        </button>
                    `,
                )
                .join("")}
                </div>
            </div>

            <!-- Clear Filters -->
            <button type="button" class="btn btn-outline-secondary btn-sm w-100" id="clearFilters">
                <i class="bi bi-x-circle me-2"></i>Limpiar filtros
            </button>
        `
    },

    attachEventListeners() {
        const titleInput = document.getElementById("filterTitle")
        const priceInput = document.getElementById("filterMaxPrice")
        const discountButtons = document.querySelectorAll(".discount-btn")
        const clearButton = document.getElementById("clearFilters")

        let debounceTimer
        titleInput.addEventListener("input", () => {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => this.onFilterChange(), 300)
        })

        priceInput.addEventListener("input", () => {
            clearTimeout(debounceTimer)
            debounceTimer = setTimeout(() => this.onFilterChange(), 300)
        })

        discountButtons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                discountButtons.forEach((b) => b.classList.remove("active"))
                e.target.closest("button").classList.add("active")
                this.onFilterChange()
            })
        })

        clearButton.addEventListener("click", () => {
            titleInput.value = ""
            priceInput.value = ""
            discountButtons.forEach((b) => b.classList.remove("active"))
            discountButtons[0].classList.add("active")
            this.onFilterChange()
        })
    },

    onFilterChange() {
        const filters = {
            title: document.getElementById("filterTitle").value,
            maxPrice: Number(document.getElementById("filterMaxPrice").value) || Number.POSITIVE_INFINITY,
            minDiscount: Number(document.querySelector(".discount-btn.active").dataset.value),
        }

        AppState.applyFilters(filters)

        import("./table.js").then(({ TableComponent }) => TableComponent.render())
        import("./pagination.js").then(({ PaginationComponent }) => PaginationComponent.render())
        this.updateTotalItems()
    },

    updateTotalItems() {
        const badge = document.getElementById("totalItems")
        if (badge) {
            badge.textContent = `${AppState.filtered.length} ofertas`
        }
    },
}
