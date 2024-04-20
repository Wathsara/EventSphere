import os
import requests
from datetime import datetime

def fetch_publications(endpoint_url, api_key):
    try:
        headers = {
            'accept': 'application/json',
            'API-Key': api_key
        }
        response = requests.get(f"{endpoint_url}/publications/", headers=headers)
        response.raise_for_status()  # Raise an error for non-2xx status codes
        publications = response.json()

        # Iterate over publications and parse conference date
        for publication in publications:
            try:
                conference_date_str = publication['conferenceDate']
                # Parse the date string with the correct format
                conference_date = datetime.strptime(conference_date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
                publication['conferenceDate'] = conference_date  # Update the parsed date in the publication
            except ValueError as e:
                print(f"Error parsing conference date for publication: {e}")
        return publications
    except Exception as e:
        print(f"Error fetching publications: {e}")
        return []

def delete_publication(endpoint_url, api_key, publication_uuid, publication):
    try:
        delete_url = f"{endpoint_url}/publication/{publication_uuid}"
        headers = {
            'accept': 'application/json',
            'API-Key': api_key
        }
        response = requests.delete(delete_url, headers=headers)
        response.raise_for_status()  # Raise an error for non-2xx status codes
        print(f"Deleted publication with UUID {publication_uuid}: {publication}" )
    except Exception as e:
        print(f"Error deleting publication with UUID {publication_uuid}")

def main():
    endpoint_url = os.environ.get('API_ENDPOINT_URL')
    api_key = os.environ.get('API_KEY')
    
    if not endpoint_url or not api_key:
        print("API endpoint URL or API key not provided in environment variables.")
        return
    # Fetch publications
    publications = fetch_publications(endpoint_url, api_key)
    # Get current date
    current_date = datetime.now()

    # Iterate over publications
    for publication in publications:
        conference_date = publication['conferenceDate']
        if conference_date < current_date:
            publication_uuid = publication['uuid']
            delete_publication(endpoint_url, api_key, publication_uuid, publication)

    print("Finish Executing the Cron JOB.")

if __name__ == '__main__':
    main()
