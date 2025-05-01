# Setting Up Activity Expiry Scheduled Tasks

The Up4It app includes an activity expiry system that automatically marks activities as expired after 4 hours.
This functionality relies on a scheduled task that should run every 5 minutes to check for and process expired activities.

## API Endpoint

The application exposes the following API endpoint for the scheduled task:

```
GET /api/cron/expire-activities
```

This endpoint requires authorization with a secret token specified in the `CRON_SECRET` environment variable.

## Setup Instructions by Hosting Environment

### Vercel (Recommended)

Vercel provides a built-in Cron Jobs feature that makes it easy to set up scheduled tasks.

1. Add the following to your `vercel.json` file in the project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/expire-activities",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

2. Set the `CRON_SECRET` environment variable in your Vercel project settings.

3. Deploy your application to Vercel.

### AWS Lambda & EventBridge

If deploying to AWS:

1. Create an EventBridge rule with a schedule expression of `rate(5 minutes)`.

2. Set the rule to trigger a Lambda function.

3. In the Lambda function, make an HTTP request to your deployed application's API endpoint:

```javascript
const https = require("https");

exports.handler = async (event) => {
  const options = {
    hostname: "your-app-url.com",
    path: "/api/cron/expire-activities",
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          body: data,
        });
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.end();
  });
};
```

### Traditional Hosting with Cron

If using a traditional hosting environment with cron access:

1. Create a cron job that runs every 5 minutes:

```bash
# Add to crontab
*/5 * * * * curl -X GET -H "Authorization: Bearer your-secret-token" https://your-app-url.com/api/cron/expire-activities
```

### Development Environment Testing

For testing the expiry system in development:

1. Set the `CRON_SECRET` in your `.env.local` file:

```
CRON_SECRET=your-development-secret
```

2. Manually trigger the API endpoint in your browser or with curl:

```bash
curl -X GET -H "Authorization: Bearer your-development-secret" http://localhost:3000/api/cron/expire-activities
```

## Monitoring

It's recommended to set up monitoring for the cron job to ensure it's running correctly. Options include:

- Vercel's built-in logging for cron jobs
- CloudWatch Logs if using AWS
- A service like Cronitor or Healthchecks.io

## Security Considerations

- Keep your `CRON_SECRET` secure and use a strong, unique value
- Consider implementing IP-based restrictions for the API endpoint
- Use HTTPS for all API calls
- Implement rate limiting to prevent abuse

## Troubleshooting

If activities aren't being expired as expected:

1. Check the logs for your cron job to ensure it's running
2. Verify the API is returning a successful response
3. Check that the `CRON_SECRET` is set correctly
4. Manually trigger the API to see if it processes any activities
5. Verify your database indexes are set up correctly for query performance
