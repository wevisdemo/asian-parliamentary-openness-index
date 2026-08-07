from typing import Tuple
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


def calculate_score(row: pd.Series) -> Tuple[float, float]:

    answer_str = row["Answer"]
    answer_options_str = row["Answer Options"]
    score = 0.0
    applicable_score = 0.0

    # Check question type
    # If single; normalize to lower case
    if row["Answer Type"] == "single":
        # Check for n/a answer
        if str(answer_str).lower() == "n/a":
            return 0.0, 0.0  # TODO: recheck for answer with n/a

        # Get selected answer & Extract score
        if re.search(answer_str + r"\)(.|\n)+?\d\)", answer_options_str):
            selected_answer = re.search(
                answer_str + r"\)(.|\n)+?\d\)", answer_options_str
            ).group(0)

            # Extract score
            score = float(re.search(r"\((\d+(\.\d+)?)\)", selected_answer).group(1))  # type: ignore

        # Extract max applicable score
        applicable_score = max(
            [float(n[0]) for n in re.findall(r"\((\d+(\.\d+)?)\)", answer_options_str)]
        )
        return score, applicable_score

    # Multiple choices
    selected_options = [op.lower() for op in str(answer_str).split(";")]
    for selected_opt in selected_options:
        # Get applicable score for this option
        _option_score_str = re.search(
            selected_opt.split("=")[0] + r"\)(.|\n)+?\d\)", answer_options_str
        ).group(0)  # type: ignore
        option_score = float(
            re.search(r"\((\d+(\.\d+)?)\)", _option_score_str).group(1)
        )  # type: ignore

        if re.search(r"=no", selected_opt):
            # Add to `applicable_score`
            applicable_score += option_score
            continue
        elif re.search(r"=n/a", selected_opt):
            continue  # Don't add `applicable_score`

        # Finally: option=yes
        score += option_score
        applicable_score += option_score

    return score, applicable_score
