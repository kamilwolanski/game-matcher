# GameMatcher

> Semantic game discovery platform powered by AI-driven tagging and a custom recommendation engine.

![GameMatcher Hero](https://gamematcher.app/og-image.png)

GameMatcher helps players discover games based on gameplay identity, mechanics, progression systems, atmosphere and thematic similarity — not just generic genres.

The platform combines:
- a handcrafted semantic game taxonomy
- AI-powered game classification
- weighted similarity scoring
- rarity-aware recommendation logic
- gameplay conflict detection
- series and developer affinity boosts

Live application:

- https://gamematcher.app

---

# Features

## Semantic recommendation engine

Instead of relying on simple genre matching, GameMatcher builds a weighted taste profile using:

- gameplay mechanics
- game structure
- pacing
- progression systems
- atmosphere
- themes
- player experience

Recommendations are ranked using a custom similarity scoring system.

---

## AI-powered game tagging

Games are automatically analyzed using OpenAI structured outputs.

The tagging pipeline generates:

- gameplay tags
- thematic tags
- progression traits
- mood and pacing traits
- tag strength hierarchy

The system also automatically propagates required parent tags.

Examples:

- `fps` → `shooter`
- `jrpg` → `rpg`
- `survival-horror` → `survival` + `horror`

---

## Custom game taxonomy

The platform uses a handcrafted semantic tag system containing categories such as:

- Genre
- Subgenre
- Structure
- Mechanics
- Progression
- Themes
- Mood
- Pace
- Perspective
- Aesthetic

Each category has different importance weights within the recommendation engine.

---

## Advanced similarity scoring

The recommendation system includes:

- rarity-based weighting
- repeated tag decay
- ultra-rare tag damping
- softmax taste aggregation
- conflict penalties
- active preference weighting
- developer affinity bonuses
- series affinity bonuses

This allows recommendations to feel significantly more relevant than basic tag matching.

---

## RAWG integration

Game metadata is fetched dynamically using the RAWG API.

Imported data includes:

- descriptions
- ratings
- platforms
- release dates
- screenshots
- game series
- developer information

Games are automatically imported and processed when missing from the local database.

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI
- Lucide Icons

## Backend

- Next.js Server Components
- Prisma ORM
- PostgreSQL

## AI / APIs

- OpenAI API
- RAWG Video Games Database API

## Infrastructure

- Vercel deployment pipeline
- Cloudflare CDN & DNS
- Cloudflare Email Routing

---

# SEO & Production Features

The application includes:

- server-side rendering
- semantic metadata
- sitemap support
- robots.txt support
- production deployment
- responsive UI
- Open Graph support
- dynamic game pages

---

# Why I Built This

Most game recommendation systems rely heavily on:

- genres
- popularity
- collaborative filtering

I wanted to experiment with a more semantic approach focused on:

- gameplay identity
- mechanics
- player experience
- progression systems
- thematic overlap

The project also became an opportunity to explore:

- recommendation system design
- AI-assisted classification
- weighted similarity algorithms
- semantic taxonomy architecture
- fullstack product development

---

# License

This project was created for portfolio and educational purposes.

Source code is available for review purposes only.
Commercial use and redistribution are not permitted.

