# Eye Exam booking app

(Cubitts technical exercise)

## Implementation 1: Vue and FastAPI



## Cal.com




### Schedule endpoint
- `/schedules`
- GET method
- query parameters:
  - date (string in the format "DD-MM-YYYY")
  - apiKey

```
GET https://api.cal.com/v1/schedules?apiKey={api_key}
```



```json
{'schedules': [{'id': 590745, 'userId': 1465348, 'name': 'Working Hours', 'timeZone': 'Europe/London', 'availability': [{'id': 15813205, 'eventTypeId': None, 'date': None, 'days': [1, 2, 3, 4, 5], 'startTime': '09:00:00', 'endTime': '17:00:00'}]}]}
```



### Availabilities endpoint

- `/availabilities`
- GET method



```
GET https://api.cal.com/v1/availabilities/{availabilities_id}
```



```json
{'availability': {'id': 15870443, 'startTime': '1970-01-01T09:00:00.000Z', 'endTime': '1970-01-01T17:00:00.000Z', 'date': None, 'scheduleId': 590745, 'days': [1, 2, 3, 4, 5], 'Schedule': {'userId': 1465348}}}
```



### Bookings endpoint

- `/bookings/`
- POST method
- JSON body:
  - name: string
  - email: email string
  - time: datetime
  - user: string

