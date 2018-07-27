class PodcastController < ApplicationController
  include ItunesHelper
  include FeedHelper
  include Pagy::Backend

  def show
    @podcast = Itunes.lookup(params[:id])

    xml = Connect.get(@podcast.feedUrl).body
    @feed = Feed.parse(xml)
    @pagy, @episodes = pagy_array(@feed.rss.channel.items)
  end

  def listen
  end

  def subscribe
  end
end
