// Admin Panel Script
document.addEventListener("DOMContentLoaded", () => {
    const discountInput = document.getElementById("discountThreshold")
    const priceInput = document.getElementById("priceThreshold")
    const itemsPerPageSelect = document.getElementById("itemsPerPage")
    const saveBtn = document.getElementById("saveConfig")
    const resetBtn = document.getElementById("resetConfig")
    const previewDiscount = document.getElementById("previewDiscount")
    const previewPrice = document.getElementById("previewPrice")

    // Load current config
    const config = window.AppConfig.get()
    discountInput.value = config.discountThreshold
    priceInput.value = config.priceThreshold
    itemsPerPageSelect.value = config.itemsPerPage
    previewDiscount.textContent = config.discountThreshold
    previewPrice.textContent = config.priceThreshold.toLocaleString()

    // Update preview on input
    discountInput.addEventListener("input", (e) => {
        previewDiscount.textContent = e.target.value
    })

    priceInput.addEventListener("input", (e) => {
        previewPrice.textContent = Number(e.target.value).toLocaleString()
    })

    // Save configuration
    saveBtn.addEventListener("click", () => {
        const newConfig = {
            discountThreshold: Number(discountInput.value),
            priceThreshold: Number(priceInput.value),
            itemsPerPage: Number(itemsPerPageSelect.value),
            apiUrl: config.apiUrl,
        }

        window.AppConfig.save(newConfig)

        // Show success message
        const alert = document.createElement("div")
        alert.className = "alert alert-success alert-dismissible fade show mt-3"
        alert.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            <strong>¡Guardado!</strong> La configuración se ha actualizado correctamente.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `
        saveBtn.parentElement.parentElement.appendChild(alert)

        setTimeout(() => {
            alert.remove()
        }, 3000)
    })

    // Reset configuration
    resetBtn.addEventListener("click", () => {
        if (confirm("¿Está seguro de restaurar la configuración por defecto?")) {
            const defaults = window.AppConfig.reset()
            discountInput.value = defaults.discountThreshold
            priceInput.value = defaults.priceThreshold
            itemsPerPageSelect.value = defaults.itemsPerPage
            previewDiscount.textContent = defaults.discountThreshold
            previewPrice.textContent = defaults.priceThreshold.toLocaleString()

            const alert = document.createElement("div")
            alert.className = "alert alert-info alert-dismissible fade show mt-3"
            alert.innerHTML = `
                <i class="bi bi-info-circle me-2"></i>
                Configuración restaurada a valores por defecto.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `
            resetBtn.parentElement.parentElement.appendChild(alert)

            setTimeout(() => {
                alert.remove()
            }, 3000)
        }
    })
})
