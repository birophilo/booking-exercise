import os

import requests
from dotenv import load_dotenv

from schemas import Booking, SlotParams

load_dotenv()

api_key = os.getenv('CALCOM_API_KEY', None)
CALCOM_API_V1_BASE_URL = 'https://api.cal.com/v1'


# STORES: each user can only have one schedule, so each store is
# represented by a unique user account. Each user is assigned a
# unique API key, so no username or ID is required by cal.com to
# retrieve the correct user, only the API key.

# USER_API_KEYS = {
#     'borough': BOROUGH_API_KEY,
#     'knightsbridge': KNIGHTSBRIDGE_API_KEY
# }

# def get_schedule_for_user(user, date: str):
#     params = {
#         'apiKey': USER_API_KEYS[user],
#         'date': date
#     }
#     url = f'{CALCOM_API_V1_BASE_URL}/bookings'
#     resp = requests.get(url, params=params)


class CalComApiClient:
    def __init__(self, API_KEY=api_key, BASE_URL='https://api.cal.com/v1'):
        self.base_url = BASE_URL
        self.params = {'apiKey': API_KEY}

        if API_KEY is None:
            raise ValueError('The Cal.com API key could not be imported')

    def get_slots(self, params):
        url = f'{self.base_url}/slots'

        # verify necessary query parameters are present
        assert SlotParams(**params)
        params.update(self.params)

        resp = requests.get(url, params=params)
        resp.raise_for_status()
        return resp.json()

    def create_booking(self, payload):
        url = f'{self.base_url}/bookings'

        # verify payload is a valid Booking
        assert Booking(**payload)

        resp = requests.get(url, params=self.params, json=payload)
        resp.raise_for_status()
        return resp.json()
