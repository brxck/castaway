# Castaway

Castaway is an application for discovering, subscribing to, and listening to
podcasts in your web browser.

![Desktop discover screenshot](/screenshots/desktop-discover.png)

![Desktop podcast screenshot](/screenshots/desktop-show.png)

![Mobile discover screenshot](/screenshots/mobile-discover.png)

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

Prerequisite: set up [Postgres.](https://www.digitalocean.com/community/tutorials/how-to-setup-ruby-on-rails-with-postgres)

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

