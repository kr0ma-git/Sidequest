# Sidequest

Your next gig is one quest away

## Changelog

Initial Commit

- Added Login/Registration UI
- Added Main Landing Page UI

2026-05-01

- Added express backend utility/middle layer
- Added job endpoint (fetch all jobs)
- Added user creation endpoint
- Fixed bottom bar tab icons
- Added user login feature (email) via supabase
- Fixed UI bug after login where statusbar would overlap with job list page

2026-05-03

- Added create job posting page
- Added job list refresher (swiping down refreshes the job list)
- Switched the mock data for debugging and testing with the actual database data
- Made a Dockerfile for server containerization
- Finished the sign up feature with room for improvement in the UI

2026-05-04

- Updated the sign up feature's validation

TODO:

- Fix Google OAuth authentication
- Create MyQuest Page
- Create Profile Page
- Add payment method, subtotal box in job creation page
- connect backend to job creation page

## NOTE

To build and run the Dockerfile for the express server:

1. Navigate to the server's root folder where the Dockerfile is found.

2. Build the Docker image.

```
docker build -t sidequest-backend .
```

3. Run the Docker image into a container (runs on port 4000)

```
docker run -p 4000:4000 sidequest-backend
```

- the left 4000 represents the PC's port
- the right 4000 represents the container's port

4. Check if the container is running.

```
docker ps
```

5. Addtional:

- Make sure you set the EXPO_PUBLIC_LOCAL_IP variable in your .env file to your local IP address. For example:

```
EXPO_PUBLIC_LOCAL_IP=http://192.168.6.1:4000
```

- You don't have to build the image again once you have already built it, you just need to run the container that it is in again.
