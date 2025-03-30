# NYC Bar Lines App

An application that shows real-time wait times for bars across New York City. Users can browse bars by neighborhood, view current wait times, and report their own observations to help others avoid long lines.

## Features

- Browse bars across different NYC neighborhoods
- View current and historical wait times for each bar
- Report wait times to help other users
- Mobile-friendly responsive design

## Technology Stack

- Frontend: React, TailwindCSS
- Backend: Vercel Serverless Functions
- Database: CockroachDB with Drizzle ORM
- Deployment: Vercel

## Local Development

To run the application locally:

1. Clone the repository
2. Create a `.env` file with the required environment variables
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Deployment

The application is configured for deployment on Vercel with automatic database migrations.