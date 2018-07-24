# Castaway

## Planning

### Models

- User has_many Subscriptions
- Subscription has_many Histories

Podcast data through API.

Only user data in database.

### Controllers

- User (Devise)
- Podcast
  - show
  - subscribe
  - listen
- Episode
  - show
  - listen
  - mark
- Page
  - discover
  - search

### API Integration

- Developing gpodder-ruby
- Grab all podcast data from API
- Optional gpodder.net sync
