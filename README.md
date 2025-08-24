# Souste Social: Frontend

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC)](https://tailwindcss.com)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Netlify-brightgreen)](https://souste-social.netlify.app/)

Souste Social is a full-stack social media web application, built as the capstone project for The Odin Project. This repository contains the frontend (React + Tailwind CSS), which handles the user interface and client-side interactions.

Backend Repository available here: https://github.com/souste/souste-social-backend

## Demo Video

[Watch on YouTube](https://www.youtube.com/watch?v=faOZH4V3Qts) 🎥

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend (linked):** [Node.js, Express, PostgreSQL, JWT, bcrypt, Cloudinary](https://github.com/souste/souste-social-backend)

## Features

- User Authentication: Sign up, login, and logout
- Create, edit, and delete posts with timestamps
- Comment on posts with edit and delete functionality
- Image uploads for posts and profile pictures
- User profiles with editable details and post history
- Friend system: send, cancel, accept, and unfriend
- Friend interactions: send, cancel, accept, and unfriend
- Private messaging between users
- Notifications for friend requests, comments, likes on posts and comments, and messages
- Form Validation for login, signup, profile edit
- Real-time messaging and notifications using Socket.IO

## Getting Started

Explore the [live demo](https://souste-social.netlify.app/) to test the app instantly (guest access available). To run the frontend locally, follow these steps:

### Prerequisites

- Node.js (v20 or higher)
- npm (v10 or higher)

### Steps

1. Clone this [repository](https://github.com/souste/souste-social-frontend)
2. Install dependencies with `npm install`.
3. Ensure the backend is running (see its README for setup)
4. Start the frontend server: `npm run dev`
5. Open http://localhost:5173/ in your browser
