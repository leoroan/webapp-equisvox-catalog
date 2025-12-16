// Modal Component
import { AppState } from "./state.js"

export const ModalComponent = {
    modal: null,
    bsModal: null,

    init() {
        this.modal = document.getElementById("gameModal")
        this.bsModal = new window.bootstrap.Modal(this.modal)
    },

    open(item) {
        const content = document.getElementById("modalContent")
        const storeLink = document.getElementById("modalStoreLink")
        const modalTitle = document.getElementById("gameModalLabel")

        modalTitle.textContent = item.title
        storeLink.href = item.url

        const discountBadgeClass =
            item.discount >= 50 ? "bg-danger" : item.discount >= 25 ? "bg-warning text-dark" : "bg-secondary"

        content.innerHTML = `
            <div class="row g-4">
                <div class="col-md-4">
                    <img 
                        src="${item.image}" 
                        alt="${item.title}" 
                        class="img-fluid rounded shadow"
                        onerror="this.src='https://via.placeholder.com/300x300?text=No+Image'"
                    >
                </div>
                <div class="col-md-8">
                    <div class="mb-3">
                        <h6 class="text-muted mb-1">Precio Original</h6>
                        <h4 class="text-decoration-line-through">$${item.original.toLocaleString()}</h4>
                    </div>
                    
                    <div class="mb-3">
                        <h6 class="text-muted mb-1">Precio Actual</h6>
                        <h2 class="text-success fw-bold">$${item.current.toLocaleString()}</h2>
                    </div>
                    
                    <div class="mb-3">
                        <h6 class="text-muted mb-1">Descuento</h6>
                        <span class="badge ${discountBadgeClass} fs-5 px-3 py-2">
                            <i class="bi bi-percent me-1"></i>${item.discount}OFF
                        </span>
                    </div>
                    
                    <div class="mb-3">
                        <h6 class="text-muted mb-1">Tipo de Oferta</h6>
                        <p class="mb-0">${item.offer}</p>
                    </div>
                    
                    ${item.discount >= AppState.config.discountThreshold
                ? `
                        <div class="alert alert-danger mb-0">
                            <i class="bi bi-fire me-2"></i>
                            <strong>¡Oferta caliente!</strong> Descuento excepcional del ${item.discount}%
                        </div>
                    `
                : ""
            }
                    
                    ${item.current < AppState.config.priceThreshold
                ? `
                        <div class="alert alert-success mb-0 mt-2">
                            <i class="bi bi-tag-fill me-2"></i>
                            <strong>¡Precio increíble!</strong> Menor a $${AppState.config.priceThreshold.toLocaleString()}
                        </div>
                    `
                : ""
            }
                </div>
            </div>
        `

        this.bsModal.show()
    },
}
