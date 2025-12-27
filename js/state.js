import { AppConfig } from "./config.js"

export const AppState = {
  data: [],
  filtered: [],
  page: 1,
  perPage: 10,
  sort: { key: "title", dir: "asc" },
  config: {},

  init() {
    this.config = AppConfig.get()
    this.perPage = this.config.itemsPerPage
  },

  setData(data) {
    this.data = data
    this.filtered = [...data]
  },

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

  applyFilters(filters) {
    const { title, maxPrice, minDiscount, isOffer } = filters

    this.filtered = this.data.filter((item) => {
      const matchTitle = !title || item.title.toLowerCase().includes(title.toLowerCase())
      const matchPrice = maxPrice === Number.POSITIVE_INFINITY || item.current <= maxPrice
      const matchDiscount = minDiscount === 0 || item.discount >= minDiscount
      const matchOferta = isOffer === null || item.isOffer === isOffer

      return matchTitle && matchPrice && matchDiscount && matchOferta
    })

    this.applySorter()
    this.page = 1
  },

  getPageItems() {
    const start = (this.page - 1) * this.perPage
    const end = start + this.perPage
    return this.filtered.slice(start, end)
  },

  getTotalPages() {
    return Math.ceil(this.filtered.length / this.perPage)
  },

  setSort(key) {
    if (this.sort.key === key) {
      this.sort.dir = this.sort.dir === "asc" ? "desc" : "asc"
    } else {
      this.sort.key = key
      this.sort.dir = "asc"
    }
    this.applySorter()
  },

  shouldHighlightDiscount(item) {
    return item.discount >= this.config.discountThreshold
  },

  shouldHighlightPrice(item) {
    return item.current > 0 && item.current < this.config.priceThreshold
  },
}
