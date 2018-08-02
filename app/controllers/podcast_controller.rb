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

    if user_signed_in?
      @episodes.map! do |episode|
        if (history = current_user.histories
                                  .where(podcast_id: params[:id], episode_id: episode.id)
                                  .take)
          episode.listened = history.listened
          episode.time = history.time
        end
        episode
      end
    end

    @pagy, @episodes = pagy_array(@episodes)
  end

  def listen
  end

  def subscribe
  end
end
