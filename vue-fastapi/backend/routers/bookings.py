from fastapi import APIRouter, HTTPException, Request
from calcom_api_client import CalComApiClient

from store_details import CALCOM_STORE_DETAILS

route = APIRouter()
calcom_client = CalComApiClient()


@route.post('/bookings')
async def create_booking(request: Request):
    try:
        booking_data = await request.json()

        store = booking_data['storeName']
        del booking_data['storeName']

        # retrieve event type ID specific to store/"user" in cal.com
        event_type_id = CALCOM_STORE_DETAILS[store.lower()]['event_type_id']
        api_key_for_user = CALCOM_STORE_DETAILS[store.lower()]['api_key']

        booking_data['eventTypeId'] = event_type_id

        response = calcom_client.create_booking(
            payload=booking_data,
            api_key=api_key_for_user
        )
        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid booking data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating booking: {str(e)}")
