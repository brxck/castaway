class PodcastController < ApplicationController
  include ItunesHelper
  include FeedHelper

  def show
    @podcast = Itunes.lookup(params[:id])

    xml = Connect.get(@podcast.feedUrl).body
    @feed = Feed.parse(xml)
  end

  def listen
  end

  def subscribe
  end
end
