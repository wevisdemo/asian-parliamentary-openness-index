import pandas as pd
from utilities import normalize_info_df
from constants import (
    COUNTRIES_DEFAULT_COLUMNS,
    RESPONDENTS_DEFAULT_COLUMNS,
    INDICATORS_DEFAULT_COLUMNS,
    INDICATORS_TRANSFORM_COLUMNS,
)


class OpennessScore:
    def __init__(
        self,
        country,
        respondent_info_df: pd.DataFrame | None = None,
        country_context_df: pd.DataFrame | None = None,
        lower_chamber_df: pd.DataFrame | None = None,
        upper_chamber_df: pd.DataFrame | None = None,
    ):
        self.country = country
        self._score = None
        self.lower_chamber_df = lower_chamber_df
        self.upper_chamber_df = upper_chamber_df

        # Normalize respondent_info_df & country_context_df
        self.respondent_info_df = normalize_info_df(respondent_info_df)
        self.country_context_df = normalize_info_df(country_context_df)

    def get_country_data(self) -> pd.DataFrame:

        if self.country_context_df is not None:
            country_context_df = self.country_context_df[COUNTRIES_DEFAULT_COLUMNS]
            country_context_df["Country"] = self.country
            return country_context_df[["Country"] + COUNTRIES_DEFAULT_COLUMNS]

        return pd.DataFrame(
            [{"Country": self.country}], columns=["Country"] + COUNTRIES_DEFAULT_COLUMNS
        )

    def get_respondent_data(self) -> pd.DataFrame:

        if self.respondent_info_df is not None:
            respondent_info_df = self.respondent_info_df[RESPONDENTS_DEFAULT_COLUMNS]
            respondent_info_df["Country"] = self.country
            return respondent_info_df[["Country"] + RESPONDENTS_DEFAULT_COLUMNS]

        return pd.DataFrame(
            [{"Country": self.country}],
            columns=["Country"] + RESPONDENTS_DEFAULT_COLUMNS,
        )

    def get_indicator_data(self) -> pd.DataFrame:

        if self.lower_chamber_df is not None:
            grouped_df = self.lower_chamber_df.groupby(
                INDICATORS_DEFAULT_COLUMNS, as_index=False
            ).size()
            grouped_df.rename(
                columns={"Section Name": "Indicator", "Section": "Indicator Number"},
                inplace=True,
            )
            return grouped_df[INDICATORS_TRANSFORM_COLUMNS].sort_values(
                "Indicator Number"
            )

        return pd.DataFrame(columns=INDICATORS_TRANSFORM_COLUMNS)

    def get_questions_data(self) -> pd.DataFrame:

        if self.lower_chamber_df is not None:
            grouped_df = self.lower_chamber_df.groupby(
                ["Question"], as_index=False
            ).sum()
            grouped_df.rename(
                columns={
                    "Section Name": "Indicator",
                    "Section": "Indicator Number",
                    "Indicator": "Question Number",
                    "answer_type": "Answer Type",
                },
                inplace=True,
            )
            return grouped_df[
                [
                    "Indicator Number",
                    "Question Number",
                    "Question",
                    "Answer Type",
                    "Answer Options",
                ]
            ].sort_values("Question Number")

        return pd.DataFrame(columns=INDICATORS_TRANSFORM_COLUMNS)
