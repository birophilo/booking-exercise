from fastapi import APIRouter, HTTPException, Request
from calcom_api_client import CalComApiClient

route = APIRouter()
calcom_client = CalComApiClient()


@route.post('/bookings')
async def create_booking(request: Request):
    try:
        booking_data = await request.json()

        # add event type (hard-coded here but will be specific to store/user)
        booking_data['eventTypeId'] = 2211735

        response = calcom_client.create_booking(booking_data)
        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid booking data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating booking: {str(e)}")
