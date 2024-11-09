import json
import csv
from collections import defaultdict

def format_json_field(value):
    """
    Ensures a field is properly formatted as JSON with double quotes.
    """
    if isinstance(value, str):
        # Attempt to parse as JSON and reformat with double quotes
        try:
            parsed_json = json.loads(value.replace("'", '"'))  # Replace single quotes with double quotes
            return json.dumps(parsed_json)  # Return properly formatted JSON
        except json.JSONDecodeError:
            # If not JSON, return as a JSON-encoded string
            return json.dumps(value)
    elif isinstance(value, list) or isinstance(value, dict):
        # Directly convert lists or dictionaries to JSON strings
        return json.dumps(value)
    return json.dumps(value)

def ndjson_to_csv_by_type(ndjson_file, output_folder):
    """
    Parses an NDJSON file containing mixed data types, separates records by `_type`,
    and writes each type to a separate CSV file, formatting JSON fields correctly.
    """
    data_by_type = defaultdict(list)
    fields_by_type = defaultdict(set)

    with open(ndjson_file, 'r', encoding='utf-8', errors='ignore') as ndjson:
        for line in ndjson:
            try:
                record = json.loads(line.strip())
                data_type = record.get('_type')
                
                if not data_type:
                    continue

                fields_by_type[data_type].update(record.keys())
                data_by_type[data_type].append(record)
            except json.JSONDecodeError:
                print(f"Skipping invalid JSON line: {line.strip()}")
                continue

    json_fields = {
        'products': ['image', 'video', 'colors', 'categories'],
        'brands': [],
        'banners': [],
        'orderdetailss': ['cart']
    }

    for data_type, records in data_by_type.items():
        csv_file = f"{output_folder}/{data_type}.csv"
        fields = sorted(fields_by_type[data_type])

        with open(csv_file, 'w', newline='', encoding='utf-8', errors='ignore') as csv_out:
            writer = csv.DictWriter(csv_out, fieldnames=fields)
            writer.writeheader()

            for record in records:
                # Format JSON fields properly
                for field in json_fields.get(data_type, []):
                    if field in record:
                        record[field] = format_json_field(record[field])

                # Process each field, defaulting to an empty list if `data_type` is not in `json_fields`
                flat_record = {
                    key: (record.get(key) if key not in json_fields.get(data_type, []) 
                          else format_json_field(record.get(key)))
                    for key in fields
                }

                writer.writerow(flat_record)

        print(f"CSV file '{csv_file}' created for type '{data_type}'.")

# Example usage
ndjson_file = 'D:/exported/dev-export-2024-11-04t16-52-24-296z/data.ndjson'  # Replace with your NDJSON file path
output_folder = 'd:/exported'  # Folder where CSVs will be saved
ndjson_to_csv_by_type(ndjson_file, output_folder)
