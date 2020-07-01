**Please note this is not an official Twilio supported application.** \
**This application does not come with any warranties. You may use this application at your own risk.** 

## Setup Instructions
**Clone** this repository. \
**Run** `cd /path/to/dir` into the root of this repository. \
**Move** `.env.sample` to `.env` \
**Edit** following details in `.env` file:

 - `PORT`: *Port to run this server on.*
 - `TWILIO_ACCOUNT_SID`: *Pulled from your Twilio account console*
 - `TWILIO_AUTH_TOKEN`: *Pulled from your Twilio account console*
 - `TWILIO_SYNC_SERVICE_SID`: *Create a sync service in your Twilio account and copy the sid - you can do this easily in API explorer from your console*
 - `TWILIO_SYNC_LIST_SID`: *Create a sync list inside your sync service and copy the sid - again, you can do this easily in API explorer from console*
 - `SENDGRID_API_KEY`: *Create a sendgrid account and grab your API key*
 - `FROM_NUMBER`: *Use the number from your Twilio account*
 - `FROM_EMAIL`: *The email address you want your emails to be sent from*

**Run** npm start to run your server.

## Creating Profiles
**Click** on `User Profiles` from the navbar. \
**Enter** contact info in `New Profile` form and then click `[Create Profile]` \
<p><img src="./static/screenshots/1_Create_Profile.png?raw=true" width="650px" /></p>

## Updating Preferences
**Click** the name of the person you would like to edit preferenes for. \
**Set** preferences for `SMS`, `Email` and `Voice`. \
**Click** `[Update Preferences]`  \
<p><img src="./static/screenshots/2_Set_Preferences.png?raw=true" width="650px" /></p>

## Sending Notifications
<p><img src="./static/screenshots/3_Send_Notification.png?raw=true" width="650px" /></p>
**Make** a HTTP `POST` request to `/notification/send/{profile_id}` with
- `type` of notification:
    - `Options:` 
        - **prescription_refills_tracking**
        - **new_message_from_healthcare_team**
        - **lab_or_test_results_tracking**
        - **claim_or_appeal_status_updates**
        - **appointment_reminders**
- `body` of message. For example:
    - *Your prescription refill is ready for pick up*
    - *There is a new message from your healthcare team*

- `subject` of message (only for email)

### Sample HTTP Notification (curl)
    curl --location --request POST 'http://localhost:8081/notification/send/35' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'type=appointment_reminders' \
    --data-urlencode 'body=You have a new message!' \
    --data-urlencode 'subject=Status update!'


### Sample HTTP Notification (javascript)
```javascript
var request = require('request');
var options = {
  'method': 'POST',
  'url': 'http://localhost:8081/notification/send/35',
  'headers': { 'Content-Type': 'application/x-www-form-urlencoded' },
  form: {
    'type': 'new_message_from_healthcare_team',
    'body': 'You have a new message in your healthcare portal!',
    'subject': 'Status update!'
  }
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});
```

