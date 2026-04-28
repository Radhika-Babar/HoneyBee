"""
Honeybee Digital – Business Listings Dashboard
FastAPI Backend  |  v2.0.0
"""

import time
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.database import engine, Base
from app.router import listings, dashboard

log = logging.getLogger("api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    log.info("Database tables verified / created.")
    yield

app = FastAPI(
    title="🐝 Business Listings API",
    description=(
        "Full-stack Business Listings Dashboard API.\n\n"
        "**Data source**: Synthetic dataset (600 listings, seed=42) with "
        "live Sulekha/Justdial scraping as optional enhancement.\n\n"
        "**Stack**: FastAPI · SQLAlchemy · MySQL"
    ),
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ───────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Request timing middleware ──────────────────────────────────────────────────
@app.middleware("http")
async def add_timing_header(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    ms = (time.perf_counter() - start) * 1000
    response.headers["X-Response-Time-Ms"] = f"{ms:.1f}"
    return response

# ── Global exception handler ───────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_handler(request: Request, exc: Exception):
    log.exception("Unhandled exception on %s", request.url)
    return JSONResponse(status_code=500, content={"detail": "Internal server error."})

# ── Routers ────────────────────────────────────────────────────────────────────
app.include_router(listings.router,  prefix="/api/listings",  tags=["Listings"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

# ── Health ─────────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"], summary="Root health check")
def root():
    return {"status": "ok", "service": "Business Listings API", "version": "2.0.0"}

@app.get("/health", tags=["Health"], summary="Liveness probe")
def health():
    return {"status": "ok"}