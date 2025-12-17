// API Data Source

const CACHE_KEY = "xb_games_cache_v2"
const CACHE_TTL = 30 * 60 * 1000 // 30 minutos
const PAGE_LIMIT = 500
const PLACEHOLDER_IMAGE =
  "https://placehold.co/60x60"

// ----------------- cache -----------------

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const cached = JSON.parse(raw)
    if (Date.now() - cached.ts > CACHE_TTL) return null

    return cached.data
  } catch {
    return null
  }
}

function saveCache(data) {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({ ts: Date.now(), data })
  )
}

// ----------------- normalización -----------------

function parseDiscount(value) {
  const num = parseFloat(String(value).replace(/[^\d.-]/g, ""))
  return isNaN(num) ? 0 : num
}

function normalize(item) {
  return {
    id: item.ID || crypto.randomUUID(),
    title: item.Title || "Sin título",
    original: Number(item["Original Price"]) || 0,
    current: Number(item["Current Price"]) || 0,
    discount: parseDiscount(item["Discount %"]),
    offer: item.Offer || "",
    url: item.URL || "#",
    image: item["Image URL"] || PLACEHOLDER_IMAGE,
    isOffer: Boolean(item["Es Oferta"]),
    isNew: Boolean(item["Es Nuevo"]),
    category: item["Categoría"] || null,
  }
}

// ----------------- data source -----------------

export class ApiDataSource {
  constructor(url) {
    this.url = url
  }

  async fetchAll() {
    // 1️⃣ cache
    const cached = loadCache()
    if (cached) {
      console.log("🟦 Datos desde cache cliente")
      return cached
    }

    // 2️⃣ fetch incremental
    let offset = 0
    let total = Infinity
    const allItems = []

    try {
      while (offset < total) {
        const res = await fetch(
          `${this.url}?action=list&limit=${PAGE_LIMIT}&offset=${offset}`
        )

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const json = await res.json()

        if (!Array.isArray(json.items)) break

        total = json.total
        allItems.push(...json.items)
        offset += PAGE_LIMIT
      }

      const normalized = allItems.map(normalize)

      // 3️⃣ cache
      saveCache(normalized)

      console.log(
        `🟩 Datos desde API remota (${normalized.length})`
      )

      return normalized
    } catch (error) {
      console.error("Error fetching data:", error)
      throw error
    }
  }
}
