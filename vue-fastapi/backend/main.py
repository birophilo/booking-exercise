import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import bookings, schedules, slots


def create_app() -> FastAPI:
    app = FastAPI()
    app.include_router(bookings.route)
    app.include_router(schedules.route)
    app.include_router(slots.route)
    return app


app = create_app()

origins = [
    'http://localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)


if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000)
