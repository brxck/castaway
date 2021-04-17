class Feed
  include ApplicationHelper

  def self.parse(xml)
    feed = Feedjira::Feed.parse_with(Feedjira::Parser::Podcast, xml)

    { episodes: process_episodes(feed.rss.channel.items),
      description: sanitize(feed.description) }
  end

  def self.process_episodes(episodes)
    episodes.map do |episode|
      # Feedjira-Podcast returns Addressable::URI if the guid is a url.
      # We need a string.
      id = if episode.guid.guid.respond_to? :path
             episode.guid.guid.path
           else
             episode.guid.guid
           end

      {
        id: id,
        title: sanitize(episode.title),
        description: sanitize(episode.description),
        duration: episode.itunes.duration,
        date: episode.pub_date,
        time: 0, # Will be overwritten if history exists.
        audio: episode.enclosure.url.to_s
      }
    end
  end

  def self.sanitize(input)
    ActionController::Base.helpers.sanitize(input)
  end
end
