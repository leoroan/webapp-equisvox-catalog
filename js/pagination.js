import { AppState } from "./state.js"

export const PaginationComponent = {
    containerBottom: null,
    containerTop: null,

    init() {
        this.containerBottom = document.getElementById("paginationBottom")
        this.containerTop = document.getElementById("paginationTop")
    },

    renderAll() {
        this.render(this.containerTop)
        this.render(this.containerBottom)
    },

    render(container) {
        if (!container) return

        const totalPages = AppState.getTotalPages()
        const currentPage = AppState.page

        if (totalPages <= 1) {
            container.innerHTML = ""
            return
        }

        let html = ""

        // Previous button
        html += `
            <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                <button class="page-link" ${currentPage === 1 ? "disabled" : ""} data-page="${currentPage - 1}">
                    <i class="bi bi-chevron-left"></i>
                </button>
            </li>
        `

        // Page numbers
        const range = 2
        const start = Math.max(1, currentPage - range)
        const end = Math.min(totalPages, currentPage + range)

        // First page
        if (start > 1) {
            html += `
                <li class="page-item">
                    <button class="page-link" data-page="1">1</button>
                </li>
            `
            if (start > 2) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>'
            }
        }

        // Page range
        for (let i = start; i <= end; i++) {
            html += `
                <li class="page-item ${i === currentPage ? "active" : ""}">
                    <button class="page-link" data-page="${i}">${i}</button>
                </li>
            `
        }

        // Last page
        if (end < totalPages) {
            if (end < totalPages - 1) {
                html += '<li class="page-item disabled"><span class="page-link">...</span></li>'
            }
            html += `
                <li class="page-item">
                    <button class="page-link" data-page="${totalPages}">${totalPages}</button>
                </li>
            `
        }

        // Next button
        html += `
            <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
                <button class="page-link" ${currentPage === totalPages ? "disabled" : ""} data-page="${currentPage + 1}">
                    <i class="bi bi-chevron-right"></i>
                </button>
            </li>
        `

        container.innerHTML = html
        this.attachEventListeners(container)
    },

    attachEventListeners(container) {
        container.querySelectorAll("button[data-page]").forEach((btn) => {
            btn.addEventListener("click", () => {
                AppState.page = Number(btn.dataset.page)

                import("./table.js").then(({ TableComponent }) => TableComponent.render())
                this.renderAll()
                window.scrollTo({ top: 0, behavior: "smooth" })
            })
        })
    },
}
