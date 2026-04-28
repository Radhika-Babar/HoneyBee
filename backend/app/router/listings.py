"""
Listings Router
---------------
Endpoints:
  POST /api/listings/          – insert one listing
  POST /api/listings/bulk      – bulk insert (scraped data)
  GET  /api/listings/          – paginated + filtered list
  GET  /api/listings/export    – download all as CSV
  GET  /api/listings/{id}      – single record
  DELETE /api/listings/{id}    – remove record
"""

import csv
import io
import math

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import ListingMaster
from app.schemas import (
    BulkInsertResponse, ListingCreate, ListingOut, PaginatedListings,
)

router = APIRouter()


# ── Write endpoints ────────────────────────────────────────────────────────────

@router.post("/", response_model=ListingOut, status_code=201,
             summary="Insert a single business listing")
def create_listing(listing: ListingCreate, db: Session = Depends(get_db)):
    obj = ListingMaster(**listing.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


@router.post("/bulk", response_model=BulkInsertResponse, status_code=201,
             summary="Bulk insert scraped listings (max 5 000 per request)")
def bulk_insert(listings: List[ListingCreate], db: Session = Depends(get_db)):
    if not listings:
        raise HTTPException(400, "Payload must contain at least one listing.")
    if len(listings) > 5_000:
        raise HTTPException(400, "Maximum 5 000 listings per request.")

    objects = [ListingMaster(**item.model_dump()) for item in listings]
    db.bulk_save_objects(objects)
    db.commit()
    return BulkInsertResponse(
        inserted=len(objects),
        message=f"Successfully inserted {len(objects)} listings.",
    )


# ── Read endpoints ─────────────────────────────────────────────────────────────

@router.get("/", response_model=PaginatedListings,
            summary="Fetch listings with optional filters and pagination")
def get_listings(
    city:     Optional[str] = Query(None, description="Filter by city (partial match)"),
    category: Optional[str] = Query(None, description="Filter by category"),
    source:   Optional[str] = Query(None, description="Filter by data source"),
    search:   Optional[str] = Query(None, description="Search business name"),
    page:     int           = Query(1,  ge=1,   description="Page number"),
    per_page: int           = Query(25, ge=1, le=200, description="Results per page"),
    db: Session = Depends(get_db),
):
    q = db.query(ListingMaster)
    if city:
        q = q.filter(ListingMaster.city.ilike(f"%{city}%"))
    if category:
        q = q.filter(ListingMaster.category.ilike(f"%{category}%"))
    if source:
        q = q.filter(ListingMaster.source.ilike(f"%{source}%"))
    if search:
        q = q.filter(ListingMaster.business_name.ilike(f"%{search}%"))

    total  = q.count()
    pages  = max(1, math.ceil(total / per_page))
    offset = (page - 1) * per_page
    data   = q.order_by(ListingMaster.id).offset(offset).limit(per_page).all()

    return PaginatedListings(total=total, page=page, per_page=per_page, pages=pages, data=data)


@router.get("/export", summary="Export all listings as CSV")
def export_csv(
    city:     Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    source:   Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    q = db.query(ListingMaster)
    if city:     q = q.filter(ListingMaster.city.ilike(f"%{city}%"))
    if category: q = q.filter(ListingMaster.category.ilike(f"%{category}%"))
    if source:   q = q.filter(ListingMaster.source.ilike(f"%{source}%"))
    rows = q.order_by(ListingMaster.id).all()

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["id", "business_name", "category", "city", "address", "phone", "source", "created_at"])
    for r in rows:
        writer.writerow([r.id, r.business_name, r.category, r.city,
                         r.address, r.phone, r.source, r.created_at])
    buf.seek(0)

    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=listings_export.csv"},
    )


@router.get("/{listing_id}", response_model=ListingOut,
            summary="Fetch a single listing by ID")
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    obj = db.query(ListingMaster).filter(ListingMaster.id == listing_id).first()
    if not obj:
        raise HTTPException(404, f"Listing {listing_id} not found.")
    return obj


@router.delete("/{listing_id}", status_code=204,
               summary="Delete a listing by ID")
def delete_listing(listing_id: int, db: Session = Depends(get_db)):
    obj = db.query(ListingMaster).filter(ListingMaster.id == listing_id).first()
    if not obj:
        raise HTTPException(404, f"Listing {listing_id} not found.")
    db.delete(obj)
    db.commit()