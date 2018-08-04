module FeedHelper
  include ApplicationHelper
  class Feed
    def self.parse(xml)
      feed = Feedjira::Feed.parse_with(Feedjira::Parser::Podcast, xml)

      { episodes: process_episodes(feed.rss.channel.items),
        description: sanitize(feed.description) }
    end

    def self.process_episodes(episodes)
      episodes.map do |episode|
        id = if episode.respond_to?(:to_s)
               episode.guid.to_s
             else
               episode.guid.guid
             end

        OpenStruct.new(
          id: id,
          title: sanitize(episode.title),
          description: sanitize(episode.description),
          duration: episode.itunes.duration,
          date: episode.pub_date,
          audio: episode.enclosure.url.to_s
        )
      end
    end

    def self.sanitize(input)
      ActionController::Base.helpers.sanitize(input)
    end
  end
end
