class PodcastController < ApplicationController
  include ItunesHelper
  include FeedHelper
  include Pagy::Backend

  def show
    if user_signed_in?
      @subscribed = current_user.subscriptions
                                .where(itunes_id: params[:id]).any?
    end

    @podcast = Itunes.lookup(params[:id])
    xml = Connect.get(@podcast.feed).body
    feed = Feed.parse(xml)
    @episodes = feed[:episodes]
    @podcast.description = feed[:description]

    @pagy, @episodes = pagy_array(@episodes)
  end

  def listen
  end

  def subscribe
  end
end
