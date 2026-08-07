import pandas as pd
from enum import Enum
from utilities import normalize_info_df, normalize_answer
from constants import (
    COUNTRIES_DEFAULT_COLUMNS,
    RESPONDENTS_DEFAULT_COLUMNS,
    INDICATORS_DEFAULT_COLUMNS,
    INDICATORS_TRANSFORM_COLUMNS,
    QUESTIONS_TRANSFORM_COLUMNS,
    ANSWERS_TRANSFORM_COLUMNS,
)


class ParliamentStructuralType(Enum):
    UNICAMERAL = 1
    BICAMERAL = 2


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

        self.parliament_type = None
        # Check and Add ParliamentStructuralType with country_context_df
        if self.country_context_df is not None:
            match self.country_context_df[
                "Is the Parliament unicameral or bicameral?"
            ].values[0]:
                case "unicameral":
                    self.parliament_type = ParliamentStructuralType.UNICAMERAL
                case "bicameral":
                    self.parliament_type = ParliamentStructuralType.BICAMERAL

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
            return grouped_df[QUESTIONS_TRANSFORM_COLUMNS].sort_values(
                "Question Number"
            )

        return pd.DataFrame(columns=QUESTIONS_TRANSFORM_COLUMNS)

    def get_processedd_answer(self, df: pd.DataFrame) -> pd.DataFrame:
        answer_df = df.groupby(["Question"], as_index=False).sum()
        answer_df.rename(
            columns={
                "Indicator": "Question Number",
                "Country Assessment Response": "Answer",
                "answer_type": "Answer Type",
            },
            inplace=True,
        )

        # Add info
        answer_df["Country"] = self.country
        answer_df["Chamber"] = None  # Add after processed

        # Normalize answer
        answer_df["Answer"] = answer_df.apply(lambda row: normalize_answer(row), axis=1)

        # TODO: calculate score
        # Calcualte & Add Score
        answer_df["Score"] = 0
        answer_df["Total Applicable Score"] = 0

        answer_df = answer_df[ANSWERS_TRANSFORM_COLUMNS]
        return answer_df

    def get_answers_data(self) -> pd.DataFrame:

        answers_df = pd.DataFrame(columns=ANSWERS_TRANSFORM_COLUMNS)
        # Extract answer from lower camber

        if self.lower_chamber_df is not None:
            lower_chamb_answer_df = self.get_processedd_answer(self.lower_chamber_df)
            lower_chamb_answer_df["Chamber"] = "Lower"
            answers_df = lower_chamb_answer_df.sort_values(
                ["Country", "Chamber", "Question Number"]
            )

        if (
            self.upper_chamber_df is not None
            and self.parliament_type == ParliamentStructuralType.BICAMERAL
        ):
            upper_chamb_answer_df = self.get_processedd_answer(self.upper_chamber_df)
            upper_chamb_answer_df["Chamber"] = "Upper"
            answers_df = pd.concat(
                [
                    answers_df,
                    upper_chamb_answer_df.sort_values(
                        ["Country", "Chamber", "Question Number"]
                    ),
                ],
                ignore_index=True,
            )

        return answers_df
