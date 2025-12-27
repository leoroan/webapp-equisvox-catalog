// Main Application
import { AppState } from "./state.js"
import { ApiDataSource } from "./data-source.js"
import { FiltersComponent } from "./filters.js"
import { TableComponent } from "./table.js"
import { ModalComponent } from "./modal.js"
import { PaginationComponent } from "./pagination.js"

const App = {
    async init() {
        try {
            AppState.init()

            FiltersComponent.init()
            TableComponent.init()
            ModalComponent.init()
            PaginationComponent.init()

            document.getElementById("tableBody").innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <p class="mt-3 text-muted">Cargando ofertas...</p>
                    </td>
                </tr>
            `

            // Fetch data
            const dataSource = new ApiDataSource(AppState.config.apiUrl)
            const data = await dataSource.fetchAll()

            // Set data and render
            AppState.setData(data)
            TableComponent.render()
            PaginationComponent.renderAll()
            FiltersComponent.updateTotalItems()

            console.log(`✅ Loaded ${data.length} offers successfully`)
        } catch (error) {
            console.error("❌ Error initializing app:", error)
            document.getElementById("tableBody").innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-5">
                        <i class="bi bi-exclamation-triangle text-danger fs-1 d-block mb-3"></i>
                        <p class="text-danger">Error al cargar las ofertas</p>
                        <button class="btn btn-outline-primary btn-sm" onclick="location.reload()">
                            <i class="bi bi-arrow-clockwise me-2"></i>Reintentar
                        </button>
                    </td>
                </tr>
            `
        }
    },
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => App.init())
} else {
    App.init()
}
