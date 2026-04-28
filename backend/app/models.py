"""ORM Models."""

from sqlalchemy import Column, DateTime, Index, Integer, String, func
from app.database import Base


class ListingMaster(Base):
    __tablename__ = "listing_master"

    id            = Column(Integer, primary_key=True, autoincrement=True, index=True)
    business_name = Column(String(255), nullable=False)
    category      = Column(String(100), nullable=False)
    city          = Column(String(100), nullable=False)
    address       = Column(String(500), nullable=True)
    phone         = Column(String(30),  nullable=True)
    source        = Column(String(100), nullable=False)
    created_at    = Column(DateTime,    server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("idx_city",     "city"),
        Index("idx_category", "category"),
        Index("idx_source",   "source"),
    )