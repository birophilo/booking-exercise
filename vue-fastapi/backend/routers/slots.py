from fastapi import APIRouter, HTTPException
from calcom_api_client import CalComApiClient

from store_details import CALCOM_STORE_DETAILS

route = APIRouter()
calcom_client = CalComApiClient()


@route.get('/slots')
async def get_slots(
    startTime: str,
    endTime: str,
    timeZone: str,
    storeName: str
):
    try:
        # retrieve event type ID specific to store/"user" in cal.com
        event_type_id = CALCOM_STORE_DETAILS[storeName.lower()]['event_type_id']
        api_key_for_user = CALCOM_STORE_DETAILS[storeName.lower()]['api_key']

        params = {
            'eventTypeId': event_type_id,
            'startTime': startTime,
            'endTime': endTime,
            'timeZone': timeZone,
        }
        response = calcom_client.get_slots(params, api_key=api_key_for_user)
        return response['slots']

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f'Invalid slot data: {str(e)}')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f'Error fetching slots: {str(e)}')
