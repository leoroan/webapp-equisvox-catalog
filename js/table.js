// Table Component
import { AppState } from "./state.js"
import { ModalComponent } from "./modal.js"

export const TableComponent = {
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
        AppState.setSort(sortKey)
        this.render()
        this.updateSortIndicators()
      })
    })
  },

  updateSortIndicators() {
    const headers = this.thead.querySelectorAll(".sortable")
    headers.forEach((header) => {
      header.classList.remove("sorted-asc", "sorted-desc")
      if (header.dataset.sort === AppState.sort.key) {
        header.classList.add(`sorted-${AppState.sort.dir}`)
      }
    })
  },

  render() {
    const items = AppState.getPageItems()

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
        let rowStyle = ""
        if (AppState.shouldHighlightDiscount(item)) {
          rowClasses.push("row-high-discount")
          rowStyle += "box-shadow: -4px 0 0 0 #7c3aed inset;" // Changed highlight color to violet for high discount rows
        }
        if (AppState.shouldHighlightPrice(item)) {
          rowClasses.push("row-low-price")
          rowStyle += "box-shadow: -4px 0 0 0 #16a34a inset;"
        }

        const discountBadgeClass =
          item.discount >= 50 ? "bg-danger" : item.discount >= 25 ? "bg-warning text-dark" : "bg-secondary"

        return `
                <tr class="${rowClasses.join(" ")}" style="${rowStyle}" data-id="${item.id}">
                    <td>
                        <img 
                            src="${item.image}" 
                            alt="${item.title}" 
                            class="game-thumbnail"
                            onerror="this.src='https://via.placeholder.com/60x60?text=No+Image'"
                        >
                    </td>
                    <td>
                        <div class="d-flex flex-wrap align-items-center gap-2">
                            <strong>${item.title}</strong>
                            ${item.esNuevo ? '<span class="badge bg-info"><i class="bi bi-star-fill me-1"></i>NUEVO</span>' : ""}
                            ${item.esOferta ? '<span class="badge bg-success"><i class="bi bi-lightning-charge-fill me-1"></i>OFERTA</span>' : ""}
                        </div>
                        <small class="text-muted">${item.categoria}</small>
                    </td>
                    <td>
                        <div class="price-info">
                            <div class="price-original-label">Antes: <span class="text-decoration-line-through">$${item.original.toLocaleString()}</span></div>
                            <div class="price-current-label fw-bold text-success">Ahora: $${item.current.toLocaleString()}</div>
                        </div>
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
                        <a href="${item.url}" target="_blank" class="btn btn-sm btn-outline-primary" onclick="event.stopPropagation()">
                            <i class="bi bi-box-arrow-up-right"></i>
                        </a>
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
        if (e.target.closest("a")) return
        const id = row.dataset.id
        const item = AppState.data.find((i) => i.id === id)
        if (item) ModalComponent.open(item)
      })
      row.style.cursor = "pointer"
    })
  },
}
