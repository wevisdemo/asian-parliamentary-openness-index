import re
import pandas as pd


def transpose_df(df: pd.DataFrame | None) -> pd.DataFrame | None:
    if df is None:
        return

    # Set the first column as index and transpose
    df_t = df.set_index(df.columns[0]).T

    # Clean up index/column names
    df_t.columns.name = None
    return df_t.reset_index(drop=True)


def normalize_respondent_info(df: pd.DataFrame | None):
    _df = transpose_df(df)
    if _df is None:
        return

    # Clean character prefix from respondent_info_df's columns
    old_columns = _df.columns
    _df = _df.rename(
        columns={col: re.sub(r"^[a-z]{1}\.\s+|\:$", "", col) for col in old_columns}
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
        self.respondent_info_df = normalize_respondent_info(respondent_info_df)
        self.country_context_df = transpose_df(country_context_df)

    def get_country_info(self) -> pd.DataFrame:
        return pd.concat([self.respondent_info_df, self.country_context_df], axis=1)
