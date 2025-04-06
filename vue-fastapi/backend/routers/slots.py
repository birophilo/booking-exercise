from fastapi import APIRouter, HTTPException
from calcom_api_client import CalComApiClient

route = APIRouter()
calcom_client = CalComApiClient()


@route.get('/slots')
async def get_slots(
    eventTypeId: str,
    startTime: str,
    endTime: str,
    timeZone: str,
):
    try:
        params = {
            "eventTypeId": eventTypeId,
            "startTime": startTime,
            "endTime": endTime,
            "timeZone": timeZone,
        }
        response = calcom_client.get_slots(params)
        return response

    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid slot data: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching slots: {str(e)}")
