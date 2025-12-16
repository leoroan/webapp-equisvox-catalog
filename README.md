# 🧭 ARQUITECTURA FINAL 

**Objetivo real**
Tener una SPA estática (GitHub Pages) que muestre datos **siempre actualizados**, sin backend propio, usando:

* **Google Sheets** → base de datos
* **Google Apps Script** → API + orquestador
* **GitHub Actions** → procesador pesado (scraping)
* **Python scraper** → genera los datos
* **Front SPA** → solo consume JSON

---

# 1️⃣ Google Sheets = BDD

Creamos un **Spreadsheet** con al menos estas hojas:

### `_meta`

Control de estado del sistema

| key          | value                |
| ------------ | -------------------- |
| last_update  | 2025-12-16T03:00:00Z |
| refresh_lock | 0                    |

👉 sirve para:

* saber cuándo fue la última actualización
* evitar ejecuciones concurrentes

---

### `xb`

La “tabla” principal (500+ filas)

Headers (fila 1):

```
ID | Title | Original Price | Current Price | Discount % | Offer | URL | Image URL
```

👉 esta hoja **ya no se edita a mano**, solo por el scraper.

---

# 2️⃣ Google Apps Script = API + cerebro

Creamos un proyecto Apps Script **vinculado al Sheet**.

## 🎯 Qué hace Apps Script

### A) Expone una API HTTP (`doGet`)

Usada por:

* el front
* GitHub Actions
* lógica de refresco

---

### B) Decide si hay que refrescar datos

Endpoint:

```
?action=status
```

Lógica real:

* lee `_meta.last_update`
* calcula horas desde la última actualización
* si pasó el límite y `refresh_lock = 0`

  * pone `refresh_lock = 1`
  * dispara GitHub Action

👉 **Apps Script NO scrapea**
👉 solo decide *cuándo* scrapea alguien más

---

### C) Sirve datos al front (API real)

Endpoints que implementaste:

#### `/list`

```
?action=list&limit=50&offset=0
```

* lee la hoja `xb`
* devuelve JSON tipado
* soporta paginación

#### `/by_id`

```
?action=by_id&id=XXXX
```

* busca por columna `ID`
* devuelve un solo juego

👉 acá hiciste el ajuste clave:

* helpers devuelven **objetos**
* solo `doGet()` devuelve `TextOutput`

---

# 3️⃣ GitHub Actions = motor de ejecución

Problema:

* Colab **no puede ejecutarse solo**
* Apps Script **no puede scrapear fuerte**
* GitHub Actions **sí puede** (gratis y estable)

👉 por eso usamos Actions como **worker**.

---

## Qué hace la Action

* se ejecuta por `repository_dispatch`
* corre en Ubuntu
* instala Python + requirements
* ejecuta tu script scraper

Y listo.

---

## Cómo se dispara

Apps Script hace un `POST` a GitHub usando:

* un **Personal Access Token**
* guardado como **secret**
* endpoint `repository_dispatch`

👉 eso fue todo el tema de tokens
👉 **NO hay OAuth, NO hay login de usuarios**

---

# 4️⃣ Python Scraper = ETL

Tu script Python ya existía.
Lo adaptamos para que:

### Antes

```
scrape → CSV
```

### Ahora

```
scrape → Google Sheets
```

Cómo:

* `gspread`
* credenciales de servicio (JSON)
* secret `GOOGLE_CREDENTIALS` en GitHub

👉 el CSV dejó de existir
👉 Sheets pasó a ser la única fuente de verdad

---

# 5️⃣ GitHub Secrets (lo que realmente usaste)

### En GitHub → Settings → Secrets → Actions

Usaste **solo estos**:

| Secret               | Para qué                    |
| -------------------- | --------------------------- |
| `TOKEN_TRIGGER`      | Apps Script → GitHub Action |
| `GOOGLE_CREDENTIALS` | Python → Google Sheets      |

👉 **NO usaste Google Cloud directamente**
👉 solo una **Service Account** mínima para Sheets

---

# 6️⃣ Frontend SPA (GitHub Pages)

Antes:

* consumía `sample_data.csv`
* parseaba texto

Ahora:

* consume Apps Script API
* recibe JSON limpio

Cambio real:

* reemplazaste `CsvDataSource`
* por `ApiDataSource`

Nada más.

👉 filtros, sort, paginación **no cambiaron**

---

# 7️⃣ Flujo completo (de punta a punta)

```
Usuario abre la web
        ↓
Front llama /?action=status
        ↓
Apps Script revisa _meta
        ↓
(si está viejo)
  → dispara GitHub Action
        ↓
GitHub Action corre Python
        ↓
Python scrapea
        ↓
Python escribe en Sheet (xb)
        ↓
Python actualiza _meta
        ↓
Front llama /?action=list
        ↓
JSON → render
```

---

# 🧠 Lo importante (para que no se te vuelva a mezclar)

* **Sheets no es backend**, es storage
* **Apps Script no es worker**, es orquestador + API
* **GitHub Actions no es backend**, es batch processor
* **Front no decide nada**, solo lee

---
