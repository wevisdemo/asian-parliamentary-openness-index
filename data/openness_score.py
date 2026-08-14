import pandas as pd
import re
from enum import Enum
from utilities import (
    normalize_info_df,
    normalize_parliament_type,
    normalize_answer,
    calculate_score,
    get_indicator_data,
    get_questions_data,
)
from constants import (
    PARLIAMENT_TYPE_COLUMN,
    COUNTRIES_DEFAULT_COLUMNS,
    RESPONDENTS_DEFAULT_COLUMNS,
    ANSWERS_TRANSFORM_COLUMNS,
    INDICATOR_CONTEXTS_DEFAULT_COLUMNS,
)


class ParliamentStructuralType(Enum):
    UNICAMERAL = "Unicameral"
    BICAMERAL = "Bicameral"


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
            match normalize_parliament_type(
                self.country_context_df[PARLIAMENT_TYPE_COLUMN].values[0]
            ):
                case ParliamentStructuralType.UNICAMERAL.value:
                    self.parliament_type = ParliamentStructuralType.UNICAMERAL
                case ParliamentStructuralType.BICAMERAL.value:
                    self.parliament_type = ParliamentStructuralType.BICAMERAL

    def get_country_data(self) -> pd.DataFrame:

        if self.country_context_df is not None:
            country_context_df = self.country_context_df[COUNTRIES_DEFAULT_COLUMNS]
            country_context_df["Country"] = self.country
            country_context_df[PARLIAMENT_TYPE_COLUMN] = country_context_df[
                PARLIAMENT_TYPE_COLUMN
            ].apply(normalize_parliament_type)
            return country_context_df[["Country"] + COUNTRIES_DEFAULT_COLUMNS]

        return pd.DataFrame(
            [{"Country": self.country}], columns=["Country"] + COUNTRIES_DEFAULT_COLUMNS
        )

    def normalize_experience_text(self, text: str) -> str:
        normalized_text = text.lower().capitalize().strip()
        if not re.search(r"year(s)?$", normalized_text):
            year_rgx_matched = re.search(r"(\d+)$", normalized_text)
            if year_rgx_matched:
                year = int(year_rgx_matched.group(1))
                normalized_text += " year" + ("s" if year > 1 else "")
        return normalized_text

    def get_respondent_data(self) -> pd.DataFrame:

        if self.respondent_info_df is not None:
            respondent_info_df = self.respondent_info_df[RESPONDENTS_DEFAULT_COLUMNS]

            # Normalize `Years of experience of parliament monitoring by the organization:`
            col = "Years of experience of parliament monitoring by the organization"
            respondent_info_df[col] = respondent_info_df[col].apply(
                lambda x: self.normalize_experience_text(str(x))
            )
            respondent_info_df["Country"] = self.country
            return respondent_info_df[["Country"] + RESPONDENTS_DEFAULT_COLUMNS]

        return pd.DataFrame(
            [{"Country": self.country}],
            columns=["Country"] + RESPONDENTS_DEFAULT_COLUMNS,
        )

    def get_indicator_data(self) -> pd.DataFrame:
        return get_indicator_data(self.lower_chamber_df)

    def get_questions_data(self) -> pd.DataFrame:
        return get_questions_data(self.lower_chamber_df)

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
        answer_df["Answer"] = answer_df["Answer"].fillna("")
        answer_df["Answer"] = answer_df.apply(lambda row: normalize_answer(row), axis=1)

        # TODO: calculate score
        # Calcualte & Add Score
        answer_df[["Score", "Total Applicable Score"]] = answer_df.apply(
            lambda row: calculate_score(row), axis=1, result_type="expand"
        )

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

    def get_processedd_context(self, df: pd.DataFrame) -> pd.DataFrame:
        chamber_df = df.copy()

        # Fill empty from merge cell in `Country context for section`
        # chamber_df['Country context for section'] = chamber_df['Country context for section'].replace('', None).ffill()
        # chamber_df['Evidence Sources (URLs)'] = chamber_df['Evidence Sources (URLs)'].replace('', None).ffill()
        grouped_df = chamber_df.groupby(["Section"], as_index=False).first()
        # print(chamber_df.head(3))
        grouped_df.rename(
            columns={
                "Section": "Indicator Number",
                "Country context for section": "Context",
                "Evidence Sources (URLs)": "Evidences",
            },
            inplace=True,
        )
        grouped_df["Country"] = self.country

        return grouped_df

    def get_indicato_contexts_data(self) -> pd.DataFrame:

        contexts_df = pd.DataFrame(columns=INDICATOR_CONTEXTS_DEFAULT_COLUMNS)

        if self.lower_chamber_df is not None:
            lower_chamb_answer_df = self.get_processedd_context(self.lower_chamber_df)
            lower_chamb_answer_df["Chamber"] = "Lower"

            contexts_df = lower_chamb_answer_df[
                INDICATOR_CONTEXTS_DEFAULT_COLUMNS
            ].sort_values("Indicator Number")

        if (
            self.upper_chamber_df is not None
            and self.parliament_type == ParliamentStructuralType.BICAMERAL
        ):
            upper_chamb_answer_df = self.get_processedd_context(self.upper_chamber_df)
            upper_chamb_answer_df["Chamber"] = "Upper"
            contexts_df = pd.concat(
                [
                    contexts_df,
                    upper_chamb_answer_df[
                        INDICATOR_CONTEXTS_DEFAULT_COLUMNS
                    ].sort_values("Indicator Number"),
                ],
                ignore_index=True,
            )

        return contexts_df
