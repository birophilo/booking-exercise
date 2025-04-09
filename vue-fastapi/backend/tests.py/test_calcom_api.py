import os
from dotenv import load_dotenv

from calcom_api_client import CalComApiClient
from store_details import CALCOM_STORE_DETAILS

load_dotenv()

api_key = os.getenv('CALCOM_API_KEY')


def test_slots():

    client = CalComApiClient()

    params = {
        'startTime': '2025-04-16T00:00:00Z',
        'endTime': '2025-04-17T00:00:00Z',
        'eventTypeId': CALCOM_STORE_DETAILS['belgravia']['event_type_id'],
        'timeZone': 'Europe/London'
    }

    data = client.get_slots(params=params, api_key=api_key)

    assert '2025-04-16' in data['slots']
    assert len(data['slots']['2025-04-16']) == 24
