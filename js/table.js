// Table Component
const TableComponent = {
    tbody: null,
    thead: null,

    init() {
        this.tbody = document.getElementById("tableBody")
        this.thead = document.querySelector("#offersTable thead")
        this.attachSortListeners()
    },

    attachSortListeners() {
        const sortableHeaders = this.thead.querySelectorAll(".sortable")
        sortableHeaders.forEach((header) => {
            header.addEventListener("click", () => {
                const sortKey = header.dataset.sort
                window.AppState.setSort(sortKey)
                this.render()
                this.updateSortIndicators()
            })
        })
    },

    updateSortIndicators() {
        const headers = this.thead.querySelectorAll(".sortable")
        headers.forEach((header) => {
            header.classList.remove("sorted-asc", "sorted-desc")
            if (header.dataset.sort === window.AppState.sort.key) {
                header.classList.add(`sorted-${window.AppState.sort.dir}`)
            }
        })
    },

    render() {
        const items = window.AppState.getPageItems()

        if (items.length === 0) {
            this.tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5 text-muted">
                        <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                        No se encontraron ofertas con los filtros aplicados
                    </td>
                </tr>
            `
            return
        }

        this.tbody.innerHTML = items
            .map((item) => {
                const rowClasses = []
                if (window.AppState.shouldHighlightDiscount(item)) {
                    rowClasses.push("row-high-discount")
                }
                if (window.AppState.shouldHighlightPrice(item)) {
                    rowClasses.push("row-low-price")
                }

                const discountBadgeClass =
                    item.discount >= 50 ? "bg-danger" : item.discount >= 25 ? "bg-warning text-dark" : "bg-secondary"

                return `
                <tr class="${rowClasses.join(" ")}" data-id="${item.id}">
                    <td>
                        <img 
                            src="${item.image}" 
                            alt="${item.title}" 
                            class="game-thumbnail"
                            onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'"
                        >
                    </td>
                    <td>
                        <strong>${item.title}</strong>
                    </td>
                    <td>
                        <div class="price-original">$${item.original.toLocaleString()}</div>
                        <div class="price-current">$${item.current.toLocaleString()}</div>
                    </td>
                    <td>
                        <span class="badge badge-discount ${discountBadgeClass}">
                            <i class="bi bi-percent me-1"></i>${item.discount}%
                        </span>
                    </td>
                    <td>
                        <small class="text-muted">${item.offer}</small>
                    </td>
                    <td>
                        <button 
                            class="btn btn-sm btn-outline-primary view-details-btn" 
                            data-id="${item.id}"
                        >
                            <i class="bi bi-eye"></i>
                        </button>
                    </td>
                </tr>
            `
            })
            .join("")

        this.attachRowEventListeners()
    },

    attachRowEventListeners() {
        // Click on row to open modal
        this.tbody.querySelectorAll("tr[data-id]").forEach((row) => {
            row.addEventListener("click", (e) => {
                if (e.target.closest("button")) return
                const id = row.dataset.id
                const item = window.AppState.data.find((i) => i.id === id)
                if (item) window.ModalComponent.open(item)
            })
        })

        // Click on view button
        this.tbody.querySelectorAll(".view-details-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation()
                const id = btn.dataset.id
                const item = window.AppState.data.find((i) => i.id === id)
                if (item) window.ModalComponent.open(item)
            })
        })
    },
}

// Make it globally accessible
window.TableComponent = TableComponent
