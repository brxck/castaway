# [Castaway](http://castaway.brockmcelroy.com)

Castaway is an application for discovering, subscribing to, and listening to
podcasts in your web browser.

![Desktop discover screenshot](/screenshots/responsive-discover.png)

![Desktop podcast screenshot](/screenshots/desktop-show.png)

## Main Features

- Player with skip & speed controls
- Responsive
- Podcast charts
- Subscriptions
- Listening history
- Search
- Categories
- Curated podcasts
- API response caching

## Development & Deployment

Prerequisite: set up [Postgres.](https://www.digitalocean.com/community/tutorials/how-to-setup-ruby-on-rails-with-postgres)

1. Clone this repository:
  
        $ git clone

2. Install dependencies:

        $ cd castaway

        $ bundle install

        $ yarn install

3. Set up database:

        $ rails db:setup

    Or when deploying to Heroku:

        $ rails db:migrate

        $ rails db:seed

4. Run server:

        $ rails server

To drop the production database and reseed:

        $ heroku pg:reset DATABASE_URL
        $ heroku run rails db:migrate
        $ heroku run rails db:seed
