import argparse
import json
import logging
import sys

import httpx

sys.path.insert(0, ".")
from scraper.scraper import run_scraper

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger(__name__)

API_URL = "http://localhost:8000/api/listings/bulk"
CHUNK   = 500


def chunk(lst, size):
    for i in range(0, len(lst), size):
        yield lst[i:i + size]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--live",      action="store_true")
    ap.add_argument("--target",    type=int, default=600)
    ap.add_argument("--json-only", action="store_true")
    args = ap.parse_args()

    log.info("Generating dataset (live=%s, target=%d)...", args.live, args.target)
    listings = run_scraper(live=args.live, target=args.target)

    if args.json_only:
        with open("listings.json", "w", encoding="utf-8") as f:
            json.dump(listings, f, indent=2)
        log.info("Saved %d listings to listings.json", len(listings))
        return

    total_inserted = 0
    try:
        with httpx.Client(timeout=60) as client:
            for i, batch in enumerate(chunk(listings, CHUNK), 1):
                log.info("Sending batch %d (%d records)...", i, len(batch))
                r = client.post(API_URL, json=batch)
                r.raise_for_status()
                total_inserted += r.json()["inserted"]
                log.info("  Batch %d done.", i)
        log.info("Done! Total inserted: %d", total_inserted)
    except httpx.ConnectError:
        log.error("Cannot connect to API. Is uvicorn running?")
        with open("listings.json", "w", encoding="utf-8") as f:
            json.dump(listings, f, indent=2)
        log.info("Saved to listings.json as fallback.")


if __name__ == "__main__":
    main()