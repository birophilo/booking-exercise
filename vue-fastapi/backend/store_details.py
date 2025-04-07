import os
from dotenv import load_dotenv

load_dotenv()

# Each Cubitts store must be represented in cal.com as a unique user, as
# schedules are specific to users. The cal.com API recognises users by
# their API keys. Each store/user has a unique event type to represent
# an appointment at a specific address. So the required details to identify
# the correct schedule and event are event type ID and API key. Username is
# not required by cal.com but included here for clarity.

belgravia_api_key = os.getenv('CUBITTS_BELGRAVIA_API_KEY')


CALCOM_STORE_DETAILS = {
    'belgravia': {
        'event_type_id': 2211735,
        'api_key': belgravia_api_key,
    }
}