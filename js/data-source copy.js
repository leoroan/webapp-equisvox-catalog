// API Data Source

const CACHE_KEY = "xb_games_cache_v1"
const CACHE_TTL = 30 * 60 * 1000 // 30 minutos

function loadCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (!raw) return null

        const cached = JSON.parse(raw)
        const age = Date.now() - cached.ts

        if (age > CACHE_TTL) return null

        return cached.data
    } catch {
        return null
    }
}

function saveCache(data) {
    localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
            ts: Date.now(),
            data,
        })
    )
}


export class ApiDataSource {
    constructor(url) {
        this.url = url
    }
    
    async fetchAll() {
        // 1️⃣ Intentar cache
        const cached = loadCache()
        if (cached) {
            console.log("🟦 Datos desde cache cliente")
            return cached
        }

        // 2️⃣ Fetch remoto
        const limit = 1000
        const fullUrl = `${this.url}?action=list&limit=${limit}`

        try {
            const res = await fetch(fullUrl)
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`)
            }

            const json = await res.json()

            if (!Array.isArray(json.items)) {
                return []
            }

            const normalized = json.items.map((item) => ({
                id: item.ID || crypto.randomUUID(),
                title: item.Title || "Sin título",
                original: Number(item["Original Price"]) || 0,
                current: Number(item["Current Price"]) || 0,
                discount: (() => {
                    const raw = item["Discount %"]
                    const num = parseFloat(String(raw).replace(/[^\d.-]/g, "")) // convierte a string antes de limpiar
                    return isNaN(num) ? 0 : num
                })(),
                offer: item.Offer || "",
                url: item.URL || "#",
                image:
                    item["Image URL"] ||
                    "https://via.placeholder.com/60x60?text=No+Image",
            }))

            // 3️⃣ Guardar cache
            saveCache(normalized)

            console.log("🟩 Datos desde API remota")
            return normalized
        } catch (error) {
            console.error("Error fetching data:", error)
            throw error
        }
    }
}

