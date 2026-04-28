"""Pydantic v2 schemas for request/response validation."""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class ListingCreate(BaseModel):
    business_name: str = Field(..., min_length=1, max_length=255, examples=["Spice Garden"])
    category:str = Field(..., min_length=1, max_length=100,  examples=["Restaurants"])
    city:str = Field(..., min_length=1, max_length=100,  examples=["Mumbai"])
    address:Optional[str] = Field(None, max_length=500)
    phone:Optional[str] = Field(None, max_length=30)
    source:str = Field(..., min_length=1, max_length=100,  examples=["Sulekha"])

    @field_validator("business_name", "category", "city", "source", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip() if isinstance(v, str) else v


class ListingOut(ListingCreate):
    id:int
    created_at:datetime

    model_config = {"from_attributes": True}


class PaginatedListings(BaseModel):
    total:int
    page:int
    per_page:int
    pages:int
    data:List[ListingOut]


class BulkInsertResponse(BaseModel):
    inserted: int
    message:  str


class CountItem(BaseModel):
    label: str
    count: int


class DashboardStats(BaseModel):
    total_listings: int
    city_wise:List[CountItem]
    category_wise:List[CountItem]
    source_wise:List[CountItem]