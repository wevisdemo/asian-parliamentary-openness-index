from pathlib import Path
import zipfile


def zip_csv_files(target_folder_path, zip_name="all_csv_files.zip"):
    # Convert string path to a Path object
    folder = Path(target_folder_path)

    # Define the full output path for the zip file
    zip_file_path = folder / zip_name

    # Find all .csv files in the folder
    csv_files = list(folder.glob("*.csv"))

    if not csv_files:
        print(f"No CSV files found in {folder}")
        return

    # Create the zip archive
    with zipfile.ZipFile(zip_file_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for file in csv_files:
            # arcname=file.name saves the file without its full directory structure
            zipf.write(file, arcname=file.name)
            print(f"Added: {file.name}")

    print(f"\nSuccess! Archive saved at: {zip_file_path}")
