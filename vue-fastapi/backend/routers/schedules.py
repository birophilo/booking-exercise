from fastapi import APIRouter

route = APIRouter()


@route.get('/schedules')
async def schedules():
    pass
