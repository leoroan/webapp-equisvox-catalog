
# 📝 Caching de datos entre Google Sheets y Frontend

Este documento explica cómo optimizar el consumo de datos desde una hoja de Google Sheets usando **Google Apps Script** y **caching en el frontend** para reducir lecturas innecesarias y mejorar la experiencia del usuario.

---

## 1️⃣ Nivel 1 — Cache en Apps Script

### Objetivo

Evitar que cada petición al endpoint lea toda la hoja de Sheets, lo que consume cuota y puede ser lento.

### Cómo se implementa

```javascript
function listGames(e) {
  const cache = CacheService.getScriptCache();
  const key = 'xb_all_v2';
  const cached = cache.get(key);
  
  if (cached) {
    const data = JSON.parse(cached);
    return applyPagination(data, e); // Función separada para paginar
  }
  
  // Leer desde Sheets si no hay cache
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('xb');
  const values = sheet.getDataRange().getValues();
  const headers = values.shift();
  
  const allItems = values.map(r =>
    Object.fromEntries(headers.map((h, i) => [h, r[i]]))
  );
  
  // Guardar cache por 1 hora
  cache.put(key, JSON.stringify(allItems), 60 * 60); // 1 hora
  
  return applyPagination(allItems, e);
}

function applyPagination(allItems, e) {
  const limit = Number(e.parameter.limit || 50);
  const offset = Number(e.parameter.offset || 0);
  
  return {
    total: allItems.length,
    offset,
    limit,
    items: allItems.slice(offset, offset + limit),
    cached: true
  };
}
```

### Ventajas

* Reduce lecturas directas de Sheets.
* Permite manejar paginación desde Apps Script.
* Se puede ajustar el tiempo de cache según necesidad (ej.: 1 hora, 30 min).

---

## 2️⃣ Nivel 3 — Cache en el Frontend

### Objetivo

Evitar llamadas repetidas al endpoint cuando el usuario navega entre páginas o filtra datos.

### Estrategia

1. **Guardar la respuesta completa en memoria** (`AppState.data`) al cargar la SPA.
2. **Aplicar filtros y paginación sobre esa copia local**, sin hacer nuevas peticiones.

### Ejemplo con tu estructura modular

```javascript
// data-source.js
export class ApiDataSource {
    constructor(url) {
        this.url = url;
        this.cache = null; // Cache local
    }

    async fetchAll() {
        if (this.cache) return this.cache; // Devuelve cache si existe

        const res = await fetch(`${this.url}?action=list&limit=500`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const json = await res.json();
        this.cache = json.items.map(item => ({
            id: item.ID || crypto.randomUUID(),
            title: item.Title || "Sin título",
            original: Number(item["Original Price"]) || 0,
            current: Number(item["Current Price"]) || 0,
            discount: parseFloat(String(item["Discount %"]).replace(/[^\d.-]/g, "")) || 0,
            offer: item.Offer || "",
            url: item.URL || "#",
            image: item["Image URL"] || "https://via.placeholder.com/60x60?text=No+Image",
        }));
        return this.cache;
    }
}
```

### Ventajas

* Solo se hace 1 petición al inicio.
* Paginación y filtros se manejan **en memoria**, rápido y sin usar cuota de Sheets.
* Compatible con tu sistema modular SPA.

---

## ⚡ Consideraciones

* **Nivel 1 (Apps Script cache)** es crítico si tienes muchas lecturas.
* **Nivel 3 (Frontend cache)** es opcional pero mejora UX y evita latencia.
* En escenarios donde los datos cambian con frecuencia, se puede combinar:

  * Cache de 1 hora en Apps Script.
  * Cache en memoria en el cliente mientras dura la sesión.
* Evitar paginación en el backend si quieres mantener filtros flexibles en el frontend, porque entonces tendrías que pedir cada página al backend y combinar filtros sería más complejo.

---

## ✅ Resumen

| Nivel | Dónde se implementa | Qué hace                   | Ventaja                                     |
| ----- | ------------------- | -------------------------- | ------------------------------------------- |
| 1     | Apps Script         | Cachea toda la hoja 1 hora | Reduce consumo de Sheets, rápido            |
| 3     | Frontend            | Cache en memoria de la SPA | Evita peticiones repetidas, filtros rápidos |

---
