from typing import Any

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class Responses(BaseModel):
    name: str
    email: str
    sms_reminder_number: Any = None
    location: dict

    model_config = ConfigDict(alias_generator=to_camel)


class Booking(BaseModel):
    event_type_id: int
    start: str
    end: str
    responses: Responses
    time_zone: str
    language: str
    title: str
    description: str | None = None
    status: str
    metadata: dict | None = {}

    model_config = ConfigDict(alias_generator=to_camel)


class SlotParams(BaseModel):
    start_time: str
    end_time: str
    event_type_id: int
    time_zone: str = 'Europe/London'

    model_config = ConfigDict(alias_generator=to_camel)
