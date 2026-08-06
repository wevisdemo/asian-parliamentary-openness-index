import re
import pandas as pd


def clean_empty_margins(df):
    rows = df.dropna(how="all").index
    cols = df.dropna(how="all", axis=1).columns

    if rows.empty or cols.empty:
        return pd.DataFrame()

    return df.loc[rows[0] : rows[-1], cols[0] : cols[-1]]


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
    df = pd.read_csv(csv_url, engine="python", on_bad_lines="warn")
    df = clean_empty_margins(df)

    return df
