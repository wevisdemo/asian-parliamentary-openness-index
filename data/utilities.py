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


def normalize_answer(row: pd.Series) -> str:
    # Check question type
    # If single; normalize to lower case
    if row["Answer Type"] == "single":
        # Check for n/a
        if not re.search(str(row["Answer"]) + r"\)\s", row["Answer Options"]):
            return "n/a"
        return str(row["Answer"]).lower()

    # Multiple choices
    selected_options_str = row["Answer"]
    # Get all possible options
    possible_options = [
        str(op).lower() for op in re.findall(r"([a-zA-Z])\)\s", row["Answer Options"])
    ]
    # Check if answer if not in option
    if not any(
        re.search(r"(^" + option + r"|\;" + option + r")", selected_options_str)
        for option in possible_options
    ):
        selected_options_str = ""

    # Get seleced options
    selected_options = [op.lower() for op in str(selected_options_str).split(";")]

    # Normalize Answer
    normalized_answer = ""
    for option in possible_options:
        # Check if option is not selected
        if not any(re.search(r"^" + option, ans) for ans in selected_options):
            normalized_answer += option + "=no;"
            continue

        # Check variant of n/a in options
        if re.search(
            r"(^" + option + r"|\;" + option + r")\(n/a\)", selected_options_str
        ):
            normalized_answer += option + "=n/a;"
            continue

        normalized_answer += option + "=yes;"

    return normalized_answer.strip(";")
