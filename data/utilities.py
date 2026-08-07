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
