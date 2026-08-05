# @apoi/data

Python pipeline for the [Asia Parliament Openness Index](../README.md). Fetches and processes index data, then writes CSV files to `output/` for the `web` app to consume.

## Stack

- Python 3.14, managed by [uv](https://docs.astral.sh/uv/)
- [Ruff](https://docs.astral.sh/ruff/) for linting and formatting

## Tasks

Run through moon from the repo root:

```
moon run data:build    # runs main.py, writes output/index.csv
moon run data:lint     # ruff check
moon run data:format   # ruff format
```

Or directly within this folder:

```
uv run main.py
```

## Output (Goal)

Write to `output` in current directory:

- CSV files according to agreed specifications in [Google Sheets](https://docs.google.com/spreadsheets/d/1e9-7tAocJU2Dk_8gwn-SfPMUqWOTxoFLbf6_k12je8k/edit?usp=sharing)
- ZIP file `apoi-2026.zip` includes
  - README.txt - keep source file in data project folder (just mock while waiting for the final text)
  - All of CSV files above
