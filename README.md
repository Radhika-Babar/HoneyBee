# 🐝 Honeybee Digital — Business Listings Dashboard

> **Intern Assignment** · Python Development Intern · Radhika

A production-quality full-stack dashboard that collects, stores, and visualises Indian business listing data across 15 cities, 12 categories, and 5 data sources.

---

## 📁 Project Structure

```
honeybee-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app (lifespan, CORS, timing middleware)
│   │   ├── database.py        # SQLAlchemy engine + session
│   │   ├── models.py          # ORM model — listing_master
│   │   ├── schemas.py         # Pydantic v2 schemas + validators
│   │   └── routers/
│   │       ├── listings.py    # CRUD + bulk insert + CSV export
│   │       └── dashboard.py   # Stats, city/category/source/trend APIs
│   ├── scraper/
│   │   └── scraper.py         # Sulekha + Justdial scraper + synthetic fallback
│   ├── tests/
│   │   └── test_api.py        # 18 pytest unit + integration tests
│   ├── seed_db.py             # One-command DB seeder
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Tabbed dashboard (5 views)
│   │   ├── components/
│   │   │   ├── StatCard.jsx       # KPI cards with hover animations
│   │   │   ├── ChartPanels.jsx    # Bar + Donut charts (Recharts)
│   │   │   ├── Skeleton.jsx       # Loading skeleton components
│   │   │   └── ListingsTable.jsx  # Search + filter + paginate + CSV export
│   │   └── hooks/
│   │       └── useApi.js          # Axios hooks with AbortController
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── database/
    └── honeybee_db.sql        # Schema + indexes + 50 sample rows + 3 views
```

---

## 🛠 Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 18, Recharts, Vite, Axios, DM Sans / Syne  |
| Backend    | FastAPI 0.111, Uvicorn, SQLAlchemy 2.0            |
| Database   | MySQL 8.0                                         |
| Scraping   | Requests, BeautifulSoup4, lxml                   |
| Testing    | pytest, TestClient (SQLite in-memory)             |

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL 8.0+

---

### 1. Clone

```bash
git clone https://github.com/YOUR_USERNAME/honeybee-dashboard.git
cd honeybee-dashboard
```

---

### 2. Database

```sql
-- In MySQL shell
CREATE DATABASE honeybee_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```bash
mysql -u root -p honeybee_db < database/honeybee_db.sql
```

---

### 3. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env → set DB_USER, DB_PASSWORD, DB_NAME

# Start API server
uvicorn app.main:app --reload --port 8000
```

Swagger UI → `http://localhost:8000/docs`  
ReDoc      → `http://localhost:8000/redoc`

---

### 4. Seed the Database

```bash
# Inside backend/ with venv active:

python seed_db.py              # 600 synthetic listings (recommended)
python seed_db.py --live       # live Sulekha/Justdial scraping + fallback
python seed_db.py --target 1000 --json-only  # just write JSON file
```

---

### 5. Frontend

```bash
cd frontend
npm install
npm run dev
```

Dashboard → `http://localhost:3000`

---

### 6. Run Tests

```bash
cd backend
pytest tests/ -v
# 18 tests covering: health, CRUD, bulk insert, filters, pagination, CSV export, dashboard stats
```

---

## 📡 API Reference

### Listings

| Method | Endpoint                   | Description                                      |
|--------|----------------------------|--------------------------------------------------|
| POST   | `/api/listings/`           | Insert one listing                               |
| POST   | `/api/listings/bulk`       | Bulk insert up to 5 000 listings                 |
| GET    | `/api/listings/`           | Paginated list (filter: city, category, source, search) |
| GET    | `/api/listings/export`     | Download filtered results as CSV                 |
| GET    | `/api/listings/{id}`       | Fetch single listing by ID                       |
| DELETE | `/api/listings/{id}`       | Delete listing                                   |

### Dashboard

| Method | Endpoint                        | Description                     |
|--------|---------------------------------|---------------------------------|
| GET    | `/api/dashboard/stats`          | All KPIs in one call            |
| GET    | `/api/dashboard/city-wise`      | City counts (top N param)       |
| GET    | `/api/dashboard/category-wise`  | Category counts                 |
| GET    | `/api/dashboard/source-wise`    | Source counts                   |
| GET    | `/api/dashboard/trend`          | Daily trend — last N days       |

---

## 🗄 Database Schema

```sql
CREATE TABLE listing_master (
  id            INT          PRIMARY KEY AUTO_INCREMENT,
  business_name VARCHAR(255) NOT NULL,
  category      VARCHAR(100) NOT NULL,
  city          VARCHAR(100) NOT NULL,
  address       VARCHAR(500),
  phone         VARCHAR(30),
  source        VARCHAR(100) NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_city     (city),
  INDEX idx_category (category),
  INDEX idx_source   (source)
);
```

Helper views: `v_city_wise_count`, `v_category_wise_count`, `v_source_wise_count`

---

## 🔍 Scraping Approach & Ethics

The scraper (`backend/scraper/scraper.py`) operates in two modes:

### Live Mode (`--live`)
- Iterates over 15 cities × 12 categories for Sulekha and Justdial
- Polite delays: **1.5–3.2 s** between every request
- HTTP 403 / 429 → immediate **15 s back-off**, then skips source
- No CAPTCHA solving, no JS execution, no authentication bypass
- Identifies with a standard browser User-Agent

### Synthetic Mode (default — recommended)
Modern versions of Sulekha and Justdial render listings via JavaScript (React/Angular SPAs). `requests + BeautifulSoup` can only parse static HTML, so live scraping typically returns empty card sets. The synthetic generator produces a **seeded (seed=42), fully reproducible** dataset of 600 listings with:
- Realistic Indian business names per category
- Actual city names from 15 major metros
- Source distribution weighted to match real directory market share (Sulekha 28%, Justdial 22%, etc.)
- 15% of listings intentionally have no phone number (mirrors real-world data quality)

This approach is **explicitly permitted** by the assignment brief: *"You may use mock/sample data if scraping is restricted."*

---

## 🎨 Dashboard Features

| Tab         | Features                                                                 |
|-------------|--------------------------------------------------------------------------|
| Overview    | 4 KPI cards · Top-cities bar chart · Source pie chart · Progress bars   |
| Cities      | Horizontal bar (all 15 cities) · City count grid with % share           |
| Categories  | Horizontal bar + donut chart                                            |
| Sources     | Source cards with % · Pie + bar charts                                  |
| Listings    | Full-text search · City/category/source filters · Pagination · CSV export |

All tabs include **loading skeletons** and a global **error banner** if the API is unreachable.

---

## ⚠️ Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| JS-rendered directory pages | Documented synthetic fallback; live mode still attempted first |
| Bulk insert performance | `bulk_save_objects()` + chunked 500-record batches |
| CORS in dev | FastAPI `CORSMiddleware` whitelisting Vite port 3000 & 5173 |
| Stale API calls on filter change | `AbortController` in `useApi.js` cancels in-flight requests |
| Test isolation (no MySQL needed) | pytest overrides `get_db` with SQLite in-memory database |

---

*Submitted by Radhika · Honeybee Digital Python Development Intern Assignment*
