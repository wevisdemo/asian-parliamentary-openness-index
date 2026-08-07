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

    # Load sheet links from json
    with open(f"{Path(__file__).resolve().parent}/sheet_links.json", "r") as fj:
        sheet_links = json.load(fj)

    # Construct OpennessScore for every country
    countries_data: List[OpennessScore] = []
    for country, links in sheet_links.items():
        # About the Respondent
        respondent_info_df = get_data_from_google_sheet(
            links.get("About the Respondent", "")
        )

        # Country Context
        country_context_df = get_data_from_google_sheet(
            links.get("Country Context", "")
        )

        # APOI - Lower Chamber
        lower_chamber_df = get_data_from_google_sheet(
            links.get("APOI - Lower Chamber", "")
        )

        # APOI - Upper Chamber
        upper_chamber_df = get_data_from_google_sheet(
            links.get("APOI - Upper Chamber", "")
        )

        countries_data.append(
            OpennessScore(
                country=country,
                respondent_info_df=respondent_info_df,
                country_context_df=country_context_df,
                lower_chamber_df=lower_chamber_df,
                upper_chamber_df=upper_chamber_df,
            )
        )

    # Constrct `countries` csv
    countries = pd.concat(
        [cos.get_country_data() for cos in countries_data], ignore_index=True
    )
    countries.to_csv(os.path.join(OUTPUT_DIR, "countries.csv"), index=False)

    # Constrct `respondents` csv
    respondents = pd.concat(
        [cos.get_respondent_data() for cos in countries_data], ignore_index=True
    )
    respondents.to_csv(os.path.join(OUTPUT_DIR, "respondents.csv"), index=False)

    # Construct `indicators` csv
    indicators = countries_data[0].get_indicator_data()
    indicators.to_csv(os.path.join(OUTPUT_DIR, "indicators.csv"), index=False)

    # Construct `questions` csv
    questions = countries_data[0].get_questions_data()
    questions.to_csv(os.path.join(OUTPUT_DIR, "questions.csv"), index=False)

    # Constrct `answers` csv
    answers = pd.concat(
        [cos.get_answers_data() for cos in countries_data], ignore_index=True
    )
    answers.to_csv(os.path.join(OUTPUT_DIR, "answers.csv"), index=False)

    # Constrct `indicator-contexts` csv
    indicator_contexts = pd.concat(
        [cos.get_indicato_contexts_data() for cos in countries_data], ignore_index=True
    )
    indicator_contexts.to_csv(
        os.path.join(OUTPUT_DIR, "indicator-contexts.csv"), index=False
    )


if __name__ == "__main__":
    main()
