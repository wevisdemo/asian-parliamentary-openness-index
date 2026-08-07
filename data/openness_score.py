import re
import pandas as pd
from constants import (
    COUNTRIES_DEFAULT_COLUMNS,
    RESPONDENTS_DEFAULT_COLUMNS,
    INDICATORS_DEFAULT_COLUMNS,
    INDICATORS_TRANSFORM_COLUMNS,
)


def transpose_df(df: pd.DataFrame | None) -> pd.DataFrame | None:
    if df is None:
        return

    # Set the first column as index and transpose
    df_t = df.set_index(df.columns[0]).T

    # Clean up index/column names
    df_t.columns.name = None
    return df_t.reset_index(drop=True)


def normalize_info_df(df: pd.DataFrame | None):
    _df = transpose_df(df)
    if _df is None:
        return

    # Clean character prefix from respondent_info_df's columns
    old_columns = _df.columns
    _df = _df.rename(
        columns={
            col: re.sub(r"^[a-z]{1}\.\s+|\:$", "", col).strip() for col in old_columns
        }
    )
    return _df


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
