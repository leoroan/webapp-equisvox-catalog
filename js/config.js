// Configuration Manager
const implementation_id = "AKfycbz4SkxgjfihoVL-XrFsug0ZzLdn8t0DN5r5qJSaFy7u98r29DXE5cGn8f6xIadA4P-6sw"
export const AppConfig = {
    // Default configuration
    defaults: {
        discountThreshold: 50,
        priceThreshold: 2000,
        itemsPerPage: 10,
        apiUrl: `https://script.google.com/macros/s/${implementation_id}/exec`,
    },

    // Load configuration from localStorage
    load() {
        const stored = localStorage.getItem("appConfig")
        if (stored) {
            try {
                return { ...this.defaults, ...JSON.parse(stored) }
            } catch (e) {
                console.error("Error loading config:", e)
                return { ...this.defaults }
            }
        }
        return { ...this.defaults }
    },

    // Save configuration to localStorage
    save(config) {
        localStorage.setItem("appConfig", JSON.stringify(config))
    },

    // Reset to defaults
    reset() {
        localStorage.removeItem("appConfig")
        return { ...this.defaults }
    },

    // Get current configuration
    get() {
        return this.load()
    },

    // Update specific config value
    update(key, value) {
        const config = this.load()
        config[key] = value
        this.save(config)
        return config
    },
}
