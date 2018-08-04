class PodcastController < ApplicationController
  include ItunesHelper
  include FeedHelper
  include Pagy::Backend

  def show
    if user_signed_in?
      @subscribed = current_user.subscriptions
                                .where(itunes_id: params[:id]).any?
    end

    @podcast = Rails.cache.fetch("podcast/#{params[:id]}", expires_in: 1.day) do
      Itunes.lookup(params[:id])
    end

    feed = Rails.cache.fetch("feed/#{params[:id]}", expires_in: 1.hour) do
    xml = Connect.get(@podcast.feed).body
      Feed.parse(xml)
    end

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
