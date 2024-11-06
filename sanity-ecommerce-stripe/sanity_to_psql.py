import json
import csv
from collections import defaultdict

def format_json_field(value):
    """
    Formats a field as a JSON string if it's not already JSON.
    """
    if isinstance(value, str):
        # Check if it's valid JSON; if not, wrap it in JSON format
        try:
            json.loads(value)  # Valid JSON
            return value  # Already JSON-formatted, return as is
        except json.JSONDecodeError:
            # Wrap the value in a JSON array if it's not valid JSON
            return json.dumps([value])
    elif isinstance(value, list) or isinstance(value, dict):
        # Convert lists or dictionaries directly to JSON strings
        return json.dumps(value)
    else:
        return json.dumps(value)

def ndjson_to_csv_by_type(ndjson_file, output_folder):
    """
    Parses an NDJSON file containing mixed data types, separates the records by `_type`,
    and writes each type to a separate CSV file, formatting JSON fields correctly.

    Parameters:
    - ndjson_file (str): Path to the input NDJSON file.
    - output_folder (str): Path to the folder where the output CSV files will be saved.
    """
    # Dictionary to store records by `_type`
    data_by_type = defaultdict(list)
    fields_by_type = defaultdict(set)

    # Read the NDJSON file and organize records by `_type`
    with open(ndjson_file, 'r', encoding='utf-8', errors='ignore') as ndjson:
        for line in ndjson:
            try:
                record = json.loads(line.strip())
                data_type = record.get('_type')
                
                # Skip if there's no `_type` field
                if not data_type:
                    continue

                # Collect fields and store the record
                fields_by_type[data_type].update(record.keys())
                data_by_type[data_type].append(record)
            except json.JSONDecodeError:
                print(f"Skipping invalid JSON line: {line.strip()}")
                continue

    # Fields expected to be JSON in each table
    json_fields = {
        'products': ['categories', 'video', 'colors'],
        'brands': [],
        'banners': [],
        'orderdetailss': ['cart']
    }

    # Write each type to a separate CSV file
    for data_type, records in data_by_type.items():
        csv_file = f"{output_folder}/{data_type}.csv"
        fields = sorted(fields_by_type[data_type])  # Use sorted fields for consistent column order

        with open(csv_file, 'w', newline='', encoding='utf-8', errors='ignore') as csv_out:
            writer = csv.DictWriter(csv_out, fieldnames=fields)
            writer.writeheader()

            for record in records:
                # Format JSON fields
                for field in json_fields.get(data_type, []):
                    if field in record:
                        record[field] = format_json_field(record[field])

                # Use get method to handle missing keys
                flat_record = {key: record.get(key, None) if not isinstance(record.get(key), dict) else json.dumps(record.get(key)) for key in fields}
                writer.writerow(flat_record)

        print(f"CSV file '{csv_file}' created for type '{data_type}'.")


# Example usage
ndjson_file = 'D:/exported/dev-export-2024-11-04t16-52-24-296z/data.ndjson'  # Replace with your NDJSON file path
output_folder = 'd:/exported'  # Folder where CSVs will be saved
ndjson_to_csv_by_type(ndjson_file, output_folder)
