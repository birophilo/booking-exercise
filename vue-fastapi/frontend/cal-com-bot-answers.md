## Cal.com API chatbot answers



**Can a user have multiple schedules?**

Yes, a user can have multiple schedules in Cal.com. Here's what you need to know:

Default Schedule: Every user should have a default schedule. For managed users, this is typically created automatically (Monday to Friday, 9AM to 5PM) based on the timezone provided during user creation.

Additional Schedules: Users can create multiple schedules beyond their default one. These additional schedules can be used for specific event types.

Purpose of Multiple Schedules: Having multiple schedules allows users to set different availability for different types of events or purposes. For example, a user might have one schedule for regular meetings and another for special consultations.

Event Type Association: After creating a non-default schedule, it can be associated with specific event types. This means when someone books that event type, availability is checked against the associated schedule rather than the default one.

API Support: The Cal.com API supports creating and managing multiple schedules. There are endpoints for creating schedules, getting schedule details, and associating schedules with event types.

This flexibility in scheduling allows users to manage their availability more precisely for different purposes or types of meetings.



**Can a user have two or more bookings for the same time?**

Based on the provided information, I cannot confidently answer whether a user can have two or more bookings for the same time. The documents provided don't directly address this specific question about overlapping bookings.

However, there are a few relevant points that might be indirectly related:

Cal.com allows users to connect multiple calendars and manage multiple schedules.
There's mention of checking for conflicts to prevent double bookings when using the useRemoveSelectedCalendar hook.
These points suggest that Cal.com has mechanisms to manage scheduling conflicts, but they don't explicitly state whether overlapping bookings are allowed or prevented. To get a definitive answer, more specific documentation or information about Cal.com's booking rules and conflict management would be needed.



**For a given date, e.g. 09-04-2025, how I retrieve the times of day that a user is available?**

To retrieve the times of day that a user is available for a given date (e.g., 09-04-2025), you can use the "Get busy times" API endpoint. Here's how you can do it:

Use the /v2/calendars/busy-times endpoint.
Provide the following query parameters:

- loggedInUsersTz: The user's timezone (e.g., 'America/New_York')
- dateFrom: The date you're interested in (e.g., '2025-09-04')
- dateTo: The same date as dateFrom (e.g., '2025-09-04')
- calendarsToLoad: An array containing the user's calendar information (credentialId and externalId)



Example request URL:

```url
https://api.cal.com/v2/calendars/busy-times?loggedInUsersTz=America%2FNew_York&dateFrom=2025-09-04&dateTo=2025-09-04&calendarsToLoad[0][credentialId]=123&calendarsToLoad[0][externalId]=user@example.com
```



This endpoint will return the busy times for the specified date. You can then infer the available times by considering the user's schedule and subtracting the busy times.

Note: To get a complete picture of availability, you should also consider:

- The user's default schedule or any custom schedules they've set up.
- Any date overrides for the specific date.
- The user's timezone settings.




**If a day is divided into 30-minute appointment time slots, what is the easiest way to retrieve information about which slots are busy and which are free from the API?**

To retrieve information about which 30-minute slots are busy and which are free for a given day, you can use the "Find out when is an event type ready to be booked" API endpoint (/v2/slots). Here's how you can do it:

Make a GET request to /v2/slots with the following parameters:

- eventTypeId or eventTypeSlug and username (depending on your use case)
- start: The date you're interested in (e.g., '2025-09-04')
- end: The same date as start
- timeZone: The user's timezone
- duration: Set this to 30 (for 30-minute slots)



Example request URL:

```url
/v2/slots?eventTypeId=10&start=2025-09-04&end=2025-09-04&timeZone=America/New_York&duration=30
```



The API will return available slots for the specified date. Each slot represents a free 30-minute period.

To determine which slots are busy, you can infer that any 30-minute period not included in the returned available slots is busy.

Optionally, you can use the slotFormat parameter set to "range" to get start and end times for each available slot:

```url
/v2/slots?eventTypeId=10&start=2025-09-04&end=2025-09-04&timeZone=America/New_York&duration=30&slotFormat=range
```


This approach allows you to easily identify both busy and free 30-minute slots for the given day.

Find a schedule
Find out when is an event type ready to be booked.
Get busy times
Get 'Add to Calendar' links for a booking
Availability settings
Obtaining Zoho Calendar Client ID and Secret



**Does the /slots endpoint return only time slots which are available, excluding unavailable time slots?**

Based on the provided documentation, I can confidently answer your question about the `/slots` endpoint.

The `/slots` endpoint returns available time slots for booking, excluding unavailable time slots. This is evident from the description in document 9, which states:

"Find out when is an event type ready to be booked."

The endpoint provides various ways to get available slots, including:

1. By event type id
2. By event type slug + username
3. By event type slug + username + organization slug (for organizations)
4. By usernames only (for dynamic event types)

The endpoint requires "start" and "end" query parameters to define the time range for which available slots should be checked. It also offers optional parameters like "timeZone" and "duration" to further customize the results.
