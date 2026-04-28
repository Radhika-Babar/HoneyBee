"""
Dashboard Router
----------------
Endpoints:
  GET /api/dashboard/stats          – combined KPI payload
  GET /api/dashboard/city-wise      – city counts (top N)
  GET /api/dashboard/category-wise  – category counts
  GET /api/dashboard/source-wise    – source counts
  GET /api/dashboard/trend          – daily insertion trend (last 30 days)
"""

from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ListingMaster
from app.schemas import CountItem, DashboardStats

router = APIRouter()


def _grouped(db: Session, column, top: Optional[int] = None):
    q = (
        db.query(column, func.count(ListingMaster.id).label("cnt"))
        .group_by(column)
        .order_by(func.count(ListingMaster.id).desc())
    )
    if top:
        q = q.limit(top)
    return q.all()


@router.get("/stats", response_model=DashboardStats,
            summary="All aggregated KPIs in one call")
def get_stats(db: Session = Depends(get_db)):
    total      = db.query(func.count(ListingMaster.id)).scalar() or 0
    city_rows  = _grouped(db, ListingMaster.city)
    cat_rows   = _grouped(db, ListingMaster.category)
    src_rows   = _grouped(db, ListingMaster.source)

    return DashboardStats(
        total_listings=total,
        city_wise=    [CountItem(label=r[0], count=r[1]) for r in city_rows],
        category_wise=[CountItem(label=r[0], count=r[1]) for r in cat_rows],
        source_wise=  [CountItem(label=r[0], count=r[1]) for r in src_rows],
    )


@router.get("/city-wise", response_model=List[CountItem],
            summary="City-wise business count (descending)")
def city_wise(
    top: int = Query(15, ge=1, le=100, description="Return top N cities"),
    db: Session = Depends(get_db),
):
    rows = _grouped(db, ListingMaster.city, top=top)
    return [CountItem(label=r[0], count=r[1]) for r in rows]


@router.get("/category-wise", response_model=List[CountItem],
            summary="Category-wise business count")
def category_wise(db: Session = Depends(get_db)):
    rows = _grouped(db, ListingMaster.category)
    return [CountItem(label=r[0], count=r[1]) for r in rows]


@router.get("/source-wise", response_model=List[CountItem],
            summary="Source-wise business count")
def source_wise(db: Session = Depends(get_db)):
    rows = _grouped(db, ListingMaster.source)
    return [CountItem(label=r[0], count=r[1]) for r in rows]


@router.get("/trend", summary="Daily listing insertion trend for the last N days")
def trend(
    days: int = Query(30, ge=7, le=90),
    db: Session = Depends(get_db),
):
    since = datetime.utcnow() - timedelta(days=days)
    rows = (
        db.query(
            func.date(ListingMaster.created_at).label("date"),
            func.count(ListingMaster.id).label("count"),
        )
        .filter(ListingMaster.created_at >= since)
        .group_by(func.date(ListingMaster.created_at))
        .order_by(func.date(ListingMaster.created_at))
        .all()
    )
    return [{"date": str(r.date), "count": r.count} for r in rows]