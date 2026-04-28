"""
Unit + Integration tests for the Business Listings API.
Run with:  pytest tests/ -v
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db
from app.models import ListingMaster

# ── In-memory SQLite for tests (no MySQL needed) ───────────────────────────────
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"
engine_test = create_engine(SQLALCHEMY_TEST_URL, connect_args={"check_same_thread": False})
TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)

Base.metadata.create_all(bind=engine_test)

def override_get_db():
    db = TestingSession()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)

SAMPLE = {
    "business_name": "Test Café",
    "category": "Restaurants",
    "city": "Mumbai",
    "address": "12, MG Road, Andheri, Mumbai",
    "phone": "+91 9876543210",
    "source": "Sulekha",
}

# ── Health ─────────────────────────────────────────────────────────────────────
def test_root():
    r = client.get("/")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_health():
    r = client.get("/health")
    assert r.status_code == 200

# ── Single insert ──────────────────────────────────────────────────────────────
def test_create_listing():
    r = client.post("/api/listings/", json=SAMPLE)
    assert r.status_code == 201
    data = r.json()
    assert data["business_name"] == SAMPLE["business_name"]
    assert "id" in data
    assert "created_at" in data

def test_create_listing_missing_field():
    r = client.post("/api/listings/", json={"business_name": "X"})
    assert r.status_code == 422   # validation error

# ── Bulk insert ────────────────────────────────────────────────────────────────
def test_bulk_insert():
    payload = [dict(SAMPLE, business_name=f"Business {i}", city="Delhi") for i in range(10)]
    r = client.post("/api/listings/bulk", json=payload)
    assert r.status_code == 201
    assert r.json()["inserted"] == 10

def test_bulk_insert_empty():
    r = client.post("/api/listings/bulk", json=[])
    assert r.status_code == 400

# ── Read / filter ──────────────────────────────────────────────────────────────
def test_get_listings_default():
    r = client.get("/api/listings/")
    assert r.status_code == 200
    body = r.json()
    assert "data" in body
    assert "total" in body
    assert "pages" in body

def test_get_listings_city_filter():
    r = client.get("/api/listings/?city=Mumbai")
    assert r.status_code == 200
    for item in r.json()["data"]:
        assert "mumbai" in item["city"].lower()

def test_get_listing_by_id():
    # create one first
    created = client.post("/api/listings/", json=SAMPLE).json()
    r = client.get(f"/api/listings/{created['id']}")
    assert r.status_code == 200
    assert r.json()["id"] == created["id"]

def test_get_listing_not_found():
    r = client.get("/api/listings/999999")
    assert r.status_code == 404

# ── Export ─────────────────────────────────────────────────────────────────────
def test_export_csv():
    r = client.get("/api/listings/export")
    assert r.status_code == 200
    assert "text/csv" in r.headers["content-type"]
    lines = r.text.strip().split("\n")
    assert lines[0].startswith("id,business_name")

# ── Dashboard ──────────────────────────────────────────────────────────────────
def test_dashboard_stats():
    r = client.get("/api/dashboard/stats")
    assert r.status_code == 200
    body = r.json()
    assert "total_listings" in body
    assert isinstance(body["city_wise"], list)
    assert isinstance(body["category_wise"], list)
    assert isinstance(body["source_wise"], list)

def test_city_wise():
    r = client.get("/api/dashboard/city-wise")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

def test_category_wise():
    r = client.get("/api/dashboard/category-wise")
    assert r.status_code == 200

def test_source_wise():
    r = client.get("/api/dashboard/source-wise")
    assert r.status_code == 200

def test_trend():
    r = client.get("/api/dashboard/trend?days=7")
    assert r.status_code == 200
    assert isinstance(r.json(), list)

# ── Delete ─────────────────────────────────────────────────────────────────────
def test_delete_listing():
    created = client.post("/api/listings/", json=SAMPLE).json()
    r = client.delete(f"/api/listings/{created['id']}")
    assert r.status_code == 204
    r2 = client.get(f"/api/listings/{created['id']}")
    assert r2.status_code == 404

def test_delete_not_found():
    r = client.delete("/api/listings/999999")
    assert r.status_code == 404