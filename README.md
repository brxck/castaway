# Castaway

Discover, subscribe, and listen to podcasts in your web browser.

## Features

- Player with skip & speed controls
- Responsive
- Podcast charts
- Subscriptions
- Listening history
- Search
- Categories
- Curated podcasts
- API response caching

## Deployment

Prerequisite: set up Postgres database.

1. Clone this repository:
  
  $ git clone

2. Install dependencies:

  $ cd castaway

  $ bundle install

3. Set up database:

  $ rails db:setup

Or when deploying to Heroku:

  $ rails db:migrate

  $ rails db:seed

4. Run server:

  $ rails server

