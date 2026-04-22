import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('API_KEY')

if not api_key:
    print("Error: API_KEY not found in .env file")
    exit(1)

url = "https://api.wynncraft.com/v3/item/database?fullResult"

headers = {
    'Authorization': f'Bearer {api_key}',
    'Content-Type': 'application/json'
}

try:
    # Send HTTP request
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    # Get JSON data
    data = response.json()
    
    # Write to data.json
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("Data successfully written to data.json")
    
except requests.exceptions.RequestException as e:
    print(f"Error making request: {e}")
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
except IOError as e:
    print(f"Error writing to file: {e}")
