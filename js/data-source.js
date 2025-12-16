// API Data Source
export class ApiDataSource {
    constructor(url) {
        this.url = url
    }

    async fetchAll() {
        const limit = 500
        const fullUrl = `${this.url}?action=list&limit=${limit}`

        try {
            const res = await fetch(fullUrl)

            if (!res.ok) {
                throw new Error(`HTTP ${res.status} ${res.statusText}`)
            }

            const text = await res.text()
            const json = JSON.parse(text)

            if (!Array.isArray(json.items)) {
                console.warn("No items found in API response")
                return []
            }

            return json.items.map((item) => ({
                id: item.ID || Math.random().toString(36),
                title: item.Title || "Sin título",
                original: Number(item["Original Price"]) || 0,
                current: Number(item["Current Price"]) || 0,
                discount: Number(String(item["Discount %"]).replace("%", "")) || 0,
                offer: item.Offer || "",
                url: item.URL || "#",
                image: item["Image URL"] || "https://via.placeholder.com/60x60?text=No+Image",
            }))
        } catch (error) {
            console.error("Error fetching data:", error)
            throw error
        }
    }
}
