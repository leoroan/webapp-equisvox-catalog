// Main Application
const App = {
    async init() {
        try {
            window.AppState.init()

            window.FiltersComponent.init()
            window.TableComponent.init()
            window.ModalComponent.init()
            window.PaginationComponent.init()

            // Show loading state
            document.getElementById("tableBody").innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Cargando...</span>
                        </div>
                        <p class="mt-3 text-muted">Cargando ofertas...</p>
                    </td>
                </tr>
            `

            // Fetch data
            const dataSource = new window.ApiDataSource(window.AppState.config.apiUrl)
            const data = await dataSource.fetchAll()

            // Set data and render
            window.AppState.setData(data)
            window.TableComponent.render()
            window.PaginationComponent.render()
            window.FiltersComponent.updateTotalItems()

            console.log(`✅ Loaded ${data.length} offers successfully`)
        } catch (error) {
            console.error("❌ Error initializing app:", error)
            document.getElementById("tableBody").innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5">
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
