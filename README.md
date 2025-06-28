# Sewa Green Team Website

Welcome to the Sewa Green Team website! This is a modern, responsive web application built with React, TypeScript, Vite, and Supabase. The platform is designed to showcase the Sewa Green Team's initiatives, events, and community impact, while providing a seamless experience for both visitors and administrators.

## Features

- **Beautiful, Responsive UI:** Modern design with smooth animations and mobile-first navigation.
- **Event Management:** Admin panel for creating, managing, and viewing events.
- **User Authentication:** Secure login and dashboard powered by Supabase Auth.
- **Dynamic Content:** Real-time updates for events, stats, and gallery.
- **Get Involved:** Easy sign-up for volunteers and new members.
- **Gallery:** Showcase of past events and initiatives.
- **Contact & About Pages:** Learn more about the team and get in touch.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Backend & Auth:** Supabase

## Project Structure

```
├── public/                # Static assets (images, logos)
├── src/
│   ├── assets/            # Images, Lottie files
│   ├── components/        # Reusable UI components
│   │   └── admin/         # Admin panel tabs
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Supabase client setup
│   ├── pages/             # Main site pages (Home, About, Dashboard, etc.)
│   ├── App.tsx            # App root
│   └── main.tsx           # Entry point
├── index.html             # Main HTML file
├── package.json           # Project metadata & scripts
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```