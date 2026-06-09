# Robflix
<img width="2864" height="1488" alt="image" src="https://github.com/user-attachments/assets/fe24ac20-d4b0-41b9-9baf-3e73ceb9570c" />


Robflix is a Netflix-inspired public-domain movie browsing app built with Next.js. The app displays a catalog of classic movies, stores movie metadata in a PostgreSQL database, and embeds videos from Internet Archive so the app does not need to host large video files directly.

## Features

* Browse a catalog of public-domain movies
* View movie cards with posters, titles, years, and genres
* Click a movie to view its detail page
* Watch embedded videos directly on the site
* Display movie descriptions, source information, and rights status
* Store movie metadata using Prisma and PostgreSQL
* Seed the database with movie data from Internet Archive

## Tech Stack

* **Next.js** - React framework using the App Router
* **TypeScript** - Type-safe JavaScript
* **Tailwind CSS** - Styling and responsive layout
* **Prisma** - ORM for database access
* **PostgreSQL / Neon** - Database for storing movie metadata
* **Internet Archive** - Source for embedded public-domain movie videos

## Project Structure

```txt
robflix/
├─ app/
│  ├─ page.tsx
│  ├─ layout.tsx
│  └─ movies/
│     └─ [slug]/
│        └─ page.tsx
├─ components/
│  └─ Navbar.tsx
├─ lib/
│  └─ prisma.ts
├─ prisma/
│  ├─ schema.prisma
│  └─ seed.ts
├─ public/
├─ package.json
└─ README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd robflix
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project.

```env
DATABASE_URL="your_postgres_connection_string"
```

### 4. Set up the database

Run the Prisma migration:

```bash
npx prisma migrate dev --name init
```

Generate the Prisma client:

```bash
npx prisma generate
```

### 5. Seed the database

Seed the database with movie metadata:

```bash
npx prisma db seed
```

To seed a larger number of movies, use:

```bash
LIMIT=300 npx prisma db seed
```

### 6. Start the development server

```bash
npm run dev
```

Open the app in your browser:

```txt
http://localhost:3000
```

## Database Model

The main model is `Movie`.

```prisma
model Movie {
  id                String   @id @default(cuid())
  slug              String   @unique
  title             String
  year              Int?
  description       String?
  runtimeMinutes    Int?
  posterUrl         String?
  genres            String[]

  sourceName        String
  sourceUrl         String
  archiveIdentifier String   @unique
  embedUrl          String

  rightsStatus      String
  rightsProofUrl    String?

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

The database stores movie metadata only. Video files are not stored in the database.

## How Video Playback Works

Robflix embeds videos using Internet Archive iframe players.

Example:

```tsx
<iframe
  src={movie.embedUrl}
  title={movie.title}
  className="h-full w-full"
  allowFullScreen
/>
```

The app stores the embed URL in the database, but the actual video file is streamed from Internet Archive.

## Movie Metadata

Each movie record stores information such as:

* Title
* Year
* Description
* Poster URL
* Genres
* Internet Archive identifier
* Embed URL
* Source URL
* Rights status

This allows the app to display a Netflix-style catalog without paying for video storage or bandwidth.

## Current Status

This project is currently in early development.

Completed:

* Next.js app setup
* Navbar
* Homepage movie grid
* Prisma database connection
* Movie metadata model
* Internet Archive seed script
* Movie detail page with embedded video player

Planned features:

* Search
* User Login
* Genre pages
* Better filtering
* Admin page for adding/editing movies
* Watchlist
* User authentication
* Improved rights verification workflow

## Important Note About Rights

Robflix is intended for public-domain and openly licensed movies. 

## License

This project is for educational and portfolio purposes.

