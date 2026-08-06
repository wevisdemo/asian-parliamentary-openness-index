"""Mock fetcher for the Asia Parliamentary Openness Index.

Real implementation will fetch and populate data from online sources.
For now it emits mock CSV files so the web app has data to render.
"""

from typing import List
import os
import json
from pathlib import Path
from sheets_retriever import get_data_from_google_sheet
from openness_score import OpennessScore
import pandas as pd

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

    # Load sheet links from json
    with open(f"{Path(__file__).resolve().parent}/sheet_links.json", "r") as fj:
        sheet_links = json.load(fj)

    # Construct OpennessScore for every country
    countries_data: List[OpennessScore] = []
    for country, links in sheet_links.items():
        respondent_info_df = get_data_from_google_sheet(
            links.get("About the Respondent", "")
        )
        country_context_df = get_data_from_google_sheet(
            links.get("Country Context", "")
        )
        countries_data.append(
            OpennessScore(
                country=country,
                respondent_info_df=respondent_info_df,
                country_context_df=country_context_df,
            )
        )

    # Constrct `countries` csv
    countries = pd.concat(
        [cos.get_country_info() for cos in countries_data], ignore_index=True
    )
    countries.to_csv(os.path.join(OUTPUT_DIR, "countries.csv"), index=False)

    # Constrct `respondents` csv
    respondents = pd.concat(
        [cos.get_respondent_info() for cos in countries_data], ignore_index=True
    )
    respondents.to_csv(os.path.join(OUTPUT_DIR, "respondents.csv"), index=False)

    # Construct index csv
    # TODO: calculate score
    pd.DataFrame(MOCK_INDEX).to_csv(output_file, index=False)


if __name__ == "__main__":
    main()
