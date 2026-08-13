import re
import pandas as pd


def clean_empty_margins(df) -> pd.DataFrame:
    result_df = df.copy()
    for col in df.columns:
        if (col == "" or col.startswith("Unnamed:")) and (df[col] == "").all():
            result_df = result_df.drop(col, axis=1)

    if len(result_df.columns) == 1:
        result_df.loc[:, ["Unnamed: -1"]] = ""
    return result_df


def get_data_from_google_sheet(sheet_url: str) -> pd.DataFrame:

    # Extract the unique Sheet ID from the URL
    sheet_id = sheet_url.split("/d/")[1].split("/")[0]

    # Extract gid
    gid = re.search(r"gid\=(\d+)", sheet_url).group(1)  # type: ignore

    # Format a direct download URL targeting CSV output
    csv_url = (
        f"https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}"
    )

    # Read the data directly into a DataFrame
    df = pd.read_csv(
        csv_url, engine="python", on_bad_lines="warn", keep_default_na=False
    )
    df = clean_empty_margins(df)

    return df
