import re
from typing import Dict, Tuple

import pandas as pd

from constants import (
    INDICATORS_DEFAULT_COLUMNS,
    INDICATORS_TRANSFORM_COLUMNS,
    QUESTIONS_TRANSFORM_COLUMNS,
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


def normalize_parliament_type(value) -> str:
    return str(value).strip().capitalize()


URL_PATTERN = re.compile(r"https?://[^\s<>\"']+")


def normalize_evidences(value) -> str:
    if pd.isna(value):
        return ""

    urls = []
    for match in URL_PATTERN.findall(str(value)):
        url = match.rstrip(".,;:")
        while url.endswith(")") and url.count(")") > url.count("("):
            url = url[:-1]

        if url and url not in urls:
            urls.append(url)

    return "\n".join(urls)


def clean_answer_options(answer_options_text: str) -> str:

    # Check if this is single select question; then return without modify
    if not re.search(r"[\u2610-\u2612]", answer_options_text):
        # remove N/A option
        cleaned_options_text = re.sub(
            r"[a-z]\).+?\((n\/a|N\/A)\)", "", answer_options_text
        ).strip()
        return cleaned_options_text

    # Replace checkbox with prefixes
    prefixes = iter(["a)", "b)", "c)", "d)", "e)", "f)", "g)"])

    # Pull the next item from the iterator on every match
    prefix_options_text = re.sub(
        r"[\u2610-\u2612]", lambda match: next(prefixes), answer_options_text
    )

    # Remove zero score option
    cleaned_options_text = re.sub(
        r"[a-z]\).+?\((0|n\/a|N\/A)\)", "", prefix_options_text
    ).strip()

    return cleaned_options_text


def get_indicator_data(df: pd.DataFrame | None = None) -> pd.DataFrame:

    if df is not None:
        grouped_df = df.groupby(INDICATORS_DEFAULT_COLUMNS, as_index=False).size()
        grouped_df.rename(
            columns={"Section Name": "Indicator", "Section": "Indicator Number"},
            inplace=True,
        )
        return grouped_df[INDICATORS_TRANSFORM_COLUMNS].sort_values("Indicator Number")

    return pd.DataFrame(columns=INDICATORS_TRANSFORM_COLUMNS)


def get_questions_data(df: pd.DataFrame | None = None) -> pd.DataFrame:

    if df is not None:
        grouped_df = df.groupby(["Question"], as_index=False).sum()
        grouped_df.rename(
            columns={
                "Section Name": "Indicator",
                "Section": "Indicator Number",
                "Indicator": "Question Number",
                "answer_type": "Answer Type",
            },
            inplace=True,
        )

        # Check for `Answer Type`
        if "Answer Type" not in grouped_df.columns:
            grouped_df["Answer Type"] = grouped_df["Question"].apply(
                lambda question_text: (
                    "multiple"
                    if re.search(r"\[.+?\]$", question_text.strip())
                    else "single"
                )
            )

        # Clean `Question`
        grouped_df["Question"] = grouped_df["Question"].apply(
            lambda question_text: re.sub(r"\[.+?\]$", "", question_text).strip()
        )

        # Clean `Answer Options`
        grouped_df["Answer Options"] = grouped_df["Answer Options"].apply(
            clean_answer_options
        )

        return grouped_df[QUESTIONS_TRANSFORM_COLUMNS].sort_values("Question Number")

    return pd.DataFrame(columns=QUESTIONS_TRANSFORM_COLUMNS)


def normalize_answer(row: pd.Series) -> str:
    # Check question type
    # If single; normalize to lower case
    if row["Answer Type"] == "single":
        # Check for n/a
        if not re.search(str(row["Answer"]).strip() + r"\)\s", row["Answer Options"]):
            return "n/a"
        return str(row["Answer"]).lower()

    # Multiple choices
    selected_options_str = row["Answer"]

    # Check if this question is n/a
    if str(selected_options_str).lower() == "n/a":
        return "n/a"

    # Get all possible options
    possible_options = list(get_option_score_index(row["Answer Options"]).keys())
    # Check if answer if not in option
    if not any(
        re.search(r"(^" + option + r"|\;" + option + r")", str(selected_options_str))
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


def get_option_score_index(answer_options_str: str) -> Dict[str, float]:
    options_str_list = [
        _[0] for _ in re.findall(r"((^|\n)[a-z]\)(.|\n)+?\d\))", answer_options_str)
    ]
    score_index = {}
    for option in options_str_list:
        option_prefix = re.search(r"([a-z])\)", option).group(1)  # type: ignore
        option_score = float(re.search(r"\((\d+(\.\d+)?)\)", option).group(1))  # type: ignore
        score_index[option_prefix] = option_score
    return score_index


def calculate_score(row: pd.Series) -> Tuple[float, float]:

    answer_str = row["Answer"]
    answer_options_str = row["Answer Options"]
    score = 0.0
    applicable_score = 0.0

    # Check n/a question
    if str(answer_str).lower() == "n/a":
        return 0.0, 0.0

    # Get score index
    score_index = get_option_score_index(answer_options_str)

    # Check question type
    # If single; normalize to lower case
    if row["Answer Type"] == "single":
        # Extract score & applicable score
        score = score_index.get(answer_str, 0.0)
        applicable_score = max(score_index.values())
        return score, applicable_score

    # Multiple choices
    selected_options = [op.lower() for op in str(answer_str).split(";")]
    for selected_opt in selected_options:
        # Extract prefix to get score from score_index
        selected_prefix = re.search(r"([a-z])\=", selected_opt).group(1)  # type: ignore

        if re.search(r"=no", selected_opt):
            # Add to `applicable_score`
            applicable_score += score_index.get(selected_prefix, 0.0)
            continue
        elif re.search(r"=n/a", selected_opt):
            continue  # Don't add `applicable_score`

        # Finally: option=yes
        score += score_index.get(selected_prefix, 0.0)
        applicable_score += score_index.get(selected_prefix, 0.0)

    return score, applicable_score
