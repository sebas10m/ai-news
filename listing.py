import os
import json

def generate_articles_json(data_folder):
    try:
        # List all files in the specified folder
        articles = [f for f in os.listdir(data_folder) if f.endswith(".html")]
        
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
