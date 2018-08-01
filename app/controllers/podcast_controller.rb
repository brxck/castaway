class PodcastController < ApplicationController
  include ItunesHelper
  include FeedHelper
  include PodcastHelper
  include Pagy::Backend

  def show
    raw_podcast = Itunes.lookup(params[:id])

    xml = Connect.get(raw_podcast.feedUrl).body
    feed = Feed.parse(xml)

    @podcast = process_podcast(raw_podcast)
    @podcast.description = sanitize(feed.description)

    episodes = process_episodes(feed.rss.channel.items)
    @pagy, @episodes = pagy_array(episodes)
  end

  def listen
  end

  def subscribe
  end
end
