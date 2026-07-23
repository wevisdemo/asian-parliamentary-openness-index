# @apoi/data

Python pipeline for the [Asia Parliament Openness Index](../README.md). Fetches and processes index data, then writes CSV files to `output/` for the `web` app to consume.

> Currently emits **mock data**. The real implementation will fetch and populate data from online sources.

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

## Output

CSV files written to `output`
