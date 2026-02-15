## Smart Bookmark App

This is a simple full-stack bookmark manager built using Next.js and Supabase.

The app allows users to sign in with Google, add bookmarks, delete bookmarks, and see updates in real time. Each user's bookmarks are private and cannot be seen by others.

This project was built as part of a Fullstack screening task.

###Live Demo

Deployed URL: https://smart-bookmark-app-one-gray.vercel.app/login

### Features

User can sign up and log in using Google OAuth only

Logged-in user can add a bookmark (title and URL)

Bookmarks are private to each user

Bookmark list updates in real time without page refresh

User can delete their own bookmarks

App is built using Next.js App Router

### Tech Stack

Frontend

Next.js (App Router)

TypeScript

Tailwind CSS

Backend

Supabase Authentication (Google OAuth)

Supabase Database (PostgreSQL)

Supabase Realtime

Deployment

Vercel

### How It Works
# Authentication

I used Supabase Google OAuth for login.
Users cannot access the dashboard without logging in.
If a user tries to open the login page while already logged in, they are redirected to the dashboard.

# Private Bookmarks

Each bookmark is stored with a user_id column.
While fetching bookmarks, I filter by the logged-in user's id.
This ensures that users only see their own bookmarks.

# Real-Time Updates

I enabled realtime for the bookmarks table in Supabase.

Then I created a realtime channel subscription in the dashboard page.

### The app listens for:

INSERT events (new bookmark added)

DELETE events (bookmark removed)

When an event happens, the UI updates immediately without refreshing the page.

### Folder Structure

app/

dashboard

login

components/

BookmarkForm

lib/

supabaseClient

### How to Run Locally

Clone the repository

git clone <your-repo-link>

Go to the project folder

cd smart-bookmark-app

Install dependencies

npm install

Create a .env.local file and add:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

Run the development server

npm run dev

Open

http://localhost:3000

### Problems I Faced and How I Solved Them

Real-time delete was not working across tabs
Solution: I set REPLICA IDENTITY FULL in Supabase so delete events include old row data.

Realtime was not triggering properly
Solution: I enabled realtime for the bookmarks table in Supabase.

Multiple login behavior confusion across tabs and browsers
Solution: I handled session checks properly using supabase.auth.getUser() and redirect logic.

Hydration mismatch while testing theme feature
Solution: I removed theme functionality and simplified the layout.

### Improvements If Given More Time

Add edit bookmark feature

Add loading skeletons

Improve UI design

Add toast notifications

Add pagination for large bookmark lists
