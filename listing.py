import os
import json
from datetime import datetime

def generate_articles_json(data_folder):
    try:
        articles = []
        
        # List all HTML files in the data folder
        for filename in os.listdir(data_folder):
            if filename.endswith(".html"):
                # Extract date from the filename (format: YYYY-MM-DD_HH-MM-SS.html)
                try:
                    base_name = os.path.splitext(filename)[0]
                    file_date = datetime.strptime(base_name.split("_")[0], "%Y-%m-%d")
                    # Format the date for the title
                    formatted_date = file_date.strftime("%B %d, %Y")
                except ValueError:
                    formatted_date = "Unknown Date"

                # Append article with title and filename
                articles.append({
                    "title": f"News Article - {formatted_date}",
                    "filename": filename
                })

        # Generate the JSON file
        articles_json_path = os.path.join(data_folder, "articles.json")
        with open(articles_json_path, "w") as json_file:
            json.dump(articles, json_file, indent=4)
        
        print(f"Generated {articles_json_path} with {len(articles)} articles.")
    except Exception as e:
        print(f"Error: {e}")

# Specify the data folder
data_folder = "data"  # Change this to your actual folder path
generate_articles_json(data_folder)
