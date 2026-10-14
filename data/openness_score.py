import pandas as pd
from enum import Enum
from utilities import (
    normalize_info_df,
    normalize_parliament_type,
    normalize_answer,
    normalize_evidences,
    calculate_score,
    get_indicator_data,
    get_questions_data,
)
from constants import (
    PARLIAMENT_TYPE_COLUMN,
    COUNTRIES_DEFAULT_COLUMNS,
    RESPONDENTS_DEFAULT_COLUMNS,
    EXPERIENCE_COLUMN,
    ANSWERS_TRANSFORM_COLUMNS,
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
        question_df: pd.DataFrame | None = None,
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
                next(
                    iter(self.country_context_df.get(PARLIAMENT_TYPE_COLUMN, [])), None
                )
            ):
                case ParliamentStructuralType.UNICAMERAL.value:
                    self.parliament_type = ParliamentStructuralType.UNICAMERAL
                case ParliamentStructuralType.BICAMERAL.value:
                    self.parliament_type = ParliamentStructuralType.BICAMERAL

        self.question_df = question_df

    def get_country_data(self) -> pd.DataFrame:
        print(f"Process country data for {self.country}...")
        if self.country_context_df is not None:
            # Normalize columns; fill with empty string if not exist
            for col in COUNTRIES_DEFAULT_COLUMNS:
                if col not in self.country_context_df.columns:
                    self.country_context_df[col] = ""

            # First row holds the answers, second row holds the optional remarks
            answer_df = self.country_context_df.iloc[:1][COUNTRIES_DEFAULT_COLUMNS]
            remark_df = (
                self.country_context_df.iloc[1:2][COUNTRIES_DEFAULT_COLUMNS]
                .add_prefix("Remark: ")
                .reset_index(drop=True)
            )
            country_context_df = pd.concat([answer_df, remark_df], axis=1)
            country_context_df[PARLIAMENT_TYPE_COLUMN] = country_context_df[
                PARLIAMENT_TYPE_COLUMN
            ].apply(normalize_parliament_type)
            country_context_df.insert(0, "Country", self.country)
            return country_context_df

        return pd.DataFrame(
            [{"Country": self.country}], columns=["Country"] + COUNTRIES_DEFAULT_COLUMNS
        )

    def get_respondent_data(self) -> pd.DataFrame:

        if self.respondent_info_df is not None:
            # Normalize columns; fill with empty string if not exist
            for col in RESPONDENTS_DEFAULT_COLUMNS:
                if col not in self.respondent_info_df.columns:
                    self.respondent_info_df[col] = ""

            respondent_info_df = self.respondent_info_df[RESPONDENTS_DEFAULT_COLUMNS]

            respondent_info_df[EXPERIENCE_COLUMN] = (
                respondent_info_df[EXPERIENCE_COLUMN].astype(str).str.strip()
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

    def get_processed_answer(self, df: pd.DataFrame) -> pd.DataFrame:

        if df.empty:
            return pd.DataFrame()

        # A question without its own context or evidences is left empty
        df = df.rename(
            columns={
                "Country context for section": "Context",
                "Evidence Sources (URLs)": "Evidences",
            }
        )
        df["Context"] = df["Context"].fillna("")
        df["Evidences"] = df["Evidences"].apply(normalize_evidences)

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

        # Construct answer options index
        answer_options = {}
        if self.question_df is not None:
            answer_options = self.question_df.set_index("Question Number")[
                "Answer Options"
            ].to_dict()

        # Normalize answer
        answer_df["Answer"] = answer_df["Answer"].fillna("")
        answer_df["Answer"] = answer_df.apply(
            lambda row: normalize_answer(
                row=row, answer_options=answer_options.get(row["Question Number"], "")
            ),
            axis=1,
        )

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
            lower_chamb_answer_df = self.get_processed_answer(self.lower_chamber_df)
            lower_chamb_answer_df["Chamber"] = "Lower"
            answers_df = lower_chamb_answer_df.sort_values(
                ["Country", "Chamber", "Question Number"]
            )

        if (
            self.upper_chamber_df is not None
            and self.parliament_type == ParliamentStructuralType.BICAMERAL
        ):
            upper_chamb_answer_df = self.get_processed_answer(self.upper_chamber_df)
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
