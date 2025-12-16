// Pagination Component
const PaginationComponent = {
    container: null,

    init() {
        this.container = document.getElementById("pagination")
    },

    render() {
        const totalPages = window.AppState.getTotalPages()
        const currentPage = window.AppState.page

        if (totalPages <= 1) {
            this.container.innerHTML = ""
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

        this.container.innerHTML = html
        this.attachEventListeners()
    },

    attachEventListeners() {
        this.container.querySelectorAll("button[data-page]").forEach((btn) => {
            btn.addEventListener("click", () => {
                window.AppState.page = Number(btn.dataset.page)
                window.TableComponent.render()
                this.render()
                window.scrollTo({ top: 0, behavior: "smooth" })
            })
        })
    },
}

// Make it globally accessible
window.PaginationComponent = PaginationComponent
