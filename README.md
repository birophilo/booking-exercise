# Cubitts Technical Project: Eye Test booking app



This implementation uses:

- **Vue.js** frontend
- **FastAPI** backend (mostly a proxy server for making requests to cal.com) 
- **Tailwind** CSS



It uses **Vanilla Javascript** rather than **Typescript**, but the Javascript code in the Vue components can be converted to Typescript fairly cleanly (TODO).

It uses **Vue.js** rather than **React**, but the component structure, rendering syntax and state management of the two frameworks have a lot of similarities, and so this app could be converted to React without too many complications (also TODO).



## Installation



Clone repo

```bash
$ git clone git@github.com:birophilo/booking-exercise.git
```



**Add API keys**

API keys for cal.com "stores" (users) will be supplied separately. These need to be saved in a file called `.env` and the file placed inside the `/vue-fastapi/backend` directory, before building the Docker containers.



**Run Docker containers**

```bash
$ cd vue-fastapi
$ docker-compose up --build
```



- The app is now running on `localhost:3000`.
- The backend that calls cal.com's API is running on `localhost:8000`.



## Using the booking app

As a Cal.com schedule is specific to a user (see below), each store will require its own Cal.com user account. For purposes of demonstration, I have created two separate user accounts but **not the full 13** (one per store). One "belongs to" **Cubitts Belgravia**, and the other applies to **Cubitts Borough**. For the purposes of this exercise, **all other stores are linked to the Belgravia "user" and schedule**. So to see different schedules, compare Borough's time slots with those of other stores. 

On the "confirm booking" modal popup, enter a real email address. The booking will be processed by Cal.com and a confirmation email will be sent to the specified email address.



## Implementation choices

**REST API vs. embeddable widget**

Cal.com offers two ways to access its calendars, a REST API, and an embeddable widget. 

- REST API: a standard web API accessibile with an API key.
- Embeddable widget. This widget can either be a string of HTML and Javascript to add to your HTML template, or an "Atom", a pre-configured React component that can be inserted in a React app.

Each approach has its pros and cons. The widget allows less code to be written (almost none if used as an HTML embed), and makes a range of display option parameters available. On the other hand, it will never offer the fully bespoke presentation of a custom-made template using the REST API. Meanwhile, using the REST API requires more setup, including a dedicated server backend to act as intermediary between the frontend and the Cal.com API (to avoid putting Cal.com API keys in frontend code). However, it reduces the integration complexity in the long run, for example if the widget changes with updates. It is also probably more scaleable for handling large numbers of stores and API keys, as these can all be configured in the internal back end.



**Handling multiple store schedules**

AFAIK, in a cal.com calendar, the relevant resources are: 

- Schedule: the calendar of days
- Availabilities: time ranges when events can be booked in a schedule
- Event Types: a type of event with a given name and duration
- Slots: a set of time slots that fit into a given available time range. For example, if a user is available for an 8-hour period, and event type lasts 30 minutes, there will be 16 bookable slots for that period. Time ranges which are already booked out in a user's schedule will be excluded from possible slots.
- Bookings: a meeting event of a given Event Type between two or more users.

When creating a booking system for multiple stores, these points are relevant:

- a user can only have one schedule, because they cannot be in two places at once. 
- "Teams" can be created and can create event types, but teams do not have schedules, only users do.

From my research (which might not be the full picture but is to the best of my knowledge) there are a couple of ways to set up multiple schedules:

1. a basic user account ($15/month per user) can be created to correspond to each store, and the user's schedule corresponds to the store's schedule. This means each Cubitts store would have a single Cal.com user account and employees will share access to this account, and assign staff availability for booked eye exam appointments outside this app.
2. higher tier user accounts ($37/month per user) allow the creation of "subteams", whereby groups of specific users can be assigned to specific event types. Subteams could be created to correspond to each store. This would allow eye test appointments to be assigned to employees within the cal.com scheduling software, and would also allow more central oversight of store appointments within a single admin account.

While option 2 is the more comprehensive, it is far more expensive: the former is $180 per year ***per store***, while the latter is $444 ***per employee per store***. Therefore I took the approach of assuming each store will be a single user account. It is possible there are other approaches.

As user identity is recognised via a unique API key, we need to hold a separate API key for each store (each user) and use the correct key in each request between our backend (FastAPI in this case) and cal.com's API. In this case, API keys are accessed via environment variables.



## Performance considerations

The main performance consideration is the time it takes to call the cal.com API. Fetching a list of time slots from the `/slots` endpoint typically take 1-2 seconds, which can cause a noticeable delay if each day's slots are only fetched when the user clicks that day on the calendar.

The approach taken here is as follows:

- When the Calendar views, the API client fetches slots for the full week ahead. Assuming most users will initially click a date in the upcoming week, there should be no lag by the time they orient themselves on the page and click on a date, as this data will be available 1-2 seconds after page load.
- If a user clicks on another date beyond the upcoming 7 days, the API client will fetch a list of slots for all days in the week that that selected day falls under. That means that if the user starts clicking a date in 2 weeks, and then clicks other dates in the same week, they will only see a short lag on the first click before time slots are displayed; for any other dates in that week all slots will have been fetched by the time the user clicks on it.
- This seems like a good balance between fetching lots of data upon page load, which may take longer, and only fetching data for each selected date.
- The range of bookable calendar dates is limited to the current month and next month, to aid store scheduling.



## Testing

First, stop any running containers with `docker-compose down`. Then, to test the backend, `cd` inside the `/backend` directory, then run:

```bash
$ docker-compose exec backend python -m pytest .
```



## API reference: Cal.com



### /slots

Get available time slots for a given user, for a date/time range.

```http
GET https://api.cal.com/v1/slots
```

**Query Parameters:**

- `startTime`: Start time in ISO format (e.g., "2025-04-09T00:00:00Z")
- `endTime`: End time in ISO format (e.g., "2025-04-09T23:59:59Z")
- `timeZone`: Time zone (e.g., "Europe/London")
- `eventTypeId`: ID of the event type
- `apiKey`: API key for authentication and identification.

**Response Example:**

```json
{
  "slots": {
    "2025-04-09": [
      { "time": "2025-04-09T09:00:00+01:00" },
      { "time": "2025-04-09T09:20:00+01:00" },
      { "time": "2025-04-09T09:40:00+01:00" },
      { "time": "2025-04-09T10:00:00+01:00" },
      { "time": "2025-04-09T10:20:00+01:00" },
      { "time": "2025-04-09T10:40:00+01:00" }
    ]
  }
}
```

#### 

### /bookings

Creates a new booking of a given event type.

```http
POST https://api.cal.com/v1/bookings
```





## API reference: FastAPI backend



### /slots



### /bookings





### Other endpoints (not used but included for future reference)

Retrieves available schedules.

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





