import { AppState } from "./state.js"

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
                    <td colspan="5" class="text-center py-5 text-muted">
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
          rowStyle += "background: linear-gradient(90deg, rgba(139, 92, 246, 0.15) 0%, transparent 100%);"
        }
        if (AppState.shouldHighlightPrice(item)) {
          rowClasses.push("row-low-price")
          rowStyle += "background: linear-gradient(90deg, rgba(22, 163, 74, 0.1) 0%, transparent 100%);"
        }

        const discountBadgeClass =
          item.discount >= 50 ? "bg-danger" : item.discount >= 25 ? "bg-warning text-dark" : "bg-secondary"

        return `
                <tr class="${rowClasses.join(" ")} clickable-row" style="${rowStyle}; cursor: pointer;" data-id="${item.id}" data-url="${item.url}">
                    <td onclick="event.stopPropagation()">
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
                            ${item.isOffer ? '<span class="badge bg-success"><i class="bi bi-lightning-charge-fill me-1"></i>OFERTA</span>' : ""}
                        </div>
                        <small class="text-muted">${item.categoria}</small>
                    </td>
                    <td>
                        <div class="price-info">
                            <div class="price-original-label text-muted"><small>Antes: <span class="text-decoration-line-through">$${item.original.toLocaleString()}</span></small></div>
                            <div class="price-current-label fw-bold text-success fs-6">Ahora: $${item.current.toLocaleString()}</div>
                        </div>
                    </td>
                    <td>
                        <span class="badge badge-discount ${discountBadgeClass}">
                            ${item.discount}%
                        </span>
                    </td>
                    <td>
                        <small class="text-muted">${item.offer}</small>
                    </td>
                </tr>
            `
      })
      .join("")

    this.attachRowEventListeners()
  },

  attachRowEventListeners() {
    this.tbody.querySelectorAll("tr[data-id]").forEach((row) => {
      row.addEventListener("click", () => {
        const url = row.dataset.url
        if (url && url !== "#") {
          window.open(url, "_blank")
        }
      })
    })
  },
}
