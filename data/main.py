"""Mock fetcher for the Asia Parliamentary Openness Index.

Real implementation will fetch and populate data from online sources.
For now it emits mock CSV files so the web app has data to render.
"""

import csv
from pathlib import Path

OUTPUT_DIR = Path(__file__).resolve().parent / "output"

MOCK_INDEX = [
    {"country": "Thailand", "year": 2025, "openness_score": 62.5, "rank": 3},
    {"country": "Japan", "year": 2025, "openness_score": 78.1, "rank": 1},
    {"country": "South Korea", "year": 2025, "openness_score": 74.9, "rank": 2},
    {"country": "Indonesia", "year": 2025, "openness_score": 58.3, "rank": 4},
    {"country": "Malaysia", "year": 2025, "openness_score": 55.0, "rank": 5},
]


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_file = OUTPUT_DIR / "index.csv"

    with output_file.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=MOCK_INDEX[0].keys())
        writer.writeheader()
        writer.writerows(MOCK_INDEX)

    print(f"Wrote {len(MOCK_INDEX)} rows to {output_file}")


if __name__ == "__main__":
    main()
