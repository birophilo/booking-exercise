import os
from dotenv import load_dotenv

load_dotenv()

# Each Cubitts store must be represented in cal.com as a unique user, as
# schedules are specific to users. The cal.com API recognises users by
# their API keys. Each store/user has a unique event type to represent
# an appointment at a specific address. So the required details to identify
# the correct schedule and event are event type ID and API key. Username is
# not required by cal.com but included here for clarity.

# For the purposes of this exercise, there are only 2 real user accounts.
# In production 1 user per store would be required.
belgravia_api_key = os.getenv('CUBITTS_BELGRAVIA_API_KEY')
borough_api_key = os.getenv('CUBITTS_BOROUGH_API_KEY')

belgravia_event_id = 2211735
borough_event_id = 2216769


CALCOM_STORE_DETAILS = {
    'belgravia': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'borough': {
        'event_type_id': borough_event_id,
        'api_key': borough_api_key,
    },
    'broadway market': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'cheapside': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'coal drops yard': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'covent garden': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'hampstead': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'islington': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'marylebone': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'notting hill': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'soho': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'spitalfields': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    },
    'st james': {
        'event_type_id': belgravia_event_id,
        'api_key': belgravia_api_key,
    }
}
