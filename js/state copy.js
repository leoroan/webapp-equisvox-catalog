// Application State Manager
import { AppConfig } from "./config.js"

export const AppState = {
    data: [],
    filtered: [],
    page: 1,
    perPage: 10,
    sort: { key: "title", dir: "asc" },
    config: {},

    // Initialize state
    init() {
        this.config = AppConfig.get()
        this.perPage = this.config.itemsPerPage
    },

    // Set data
    setData(data) {
        this.data = data
        this.filtered = [...data]
    },

    // Apply sorting
    applySorter() {
        const { key, dir } = this.sort
        const multiplier = dir === "asc" ? 1 : -1

        this.filtered.sort((a, b) => {
            if (typeof a[key] === "string") {
                return a[key].localeCompare(b[key]) * multiplier
            }
            return (a[key] - b[key]) * multiplier
        })
    },

    // Apply filters
    applyFilters(filters) {
        const { title, maxPrice, minDiscount } = filters

        this.filtered = this.data.filter((item) => {
            const matchTitle = !title || item.title.toLowerCase().includes(title.toLowerCase())
            const matchPrice = !maxPrice || item.current <= maxPrice
            const matchDiscount = !minDiscount || item.discount >= minDiscount

            return matchTitle && matchPrice && matchDiscount
        })

        this.applySorter()
        this.page = 1
    },

    // Get current page items
    getPageItems() {
        const start = (this.page - 1) * this.perPage
        const end = start + this.perPage
        return this.filtered.slice(start, end)
    },

    // Get total pages
    getTotalPages() {
        return Math.ceil(this.filtered.length / this.perPage)
    },

    // Set sort
    setSort(key) {
        if (this.sort.key === key) {
            this.sort.dir = this.sort.dir === "asc" ? "desc" : "asc"
        } else {
            this.sort.key = key
            this.sort.dir = "asc"
        }
        this.applySorter()
    },

    // Should highlight row
    shouldHighlightDiscount(item) {
        return item.discount >= this.config.discountThreshold
    },

    shouldHighlightPrice(item) {
        return item.current > 0 && item.current < this.config.priceThreshold
    },
}
