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

    @podcast.description = feed[:description]

    @episodes = feed[:episodes].map { |episode| [episode.id, episode] }.to_h
    episode_ids = @episodes.each_with_object([]) do |(_, episode), ids|
      ids << episode.id
    end

    histories = current_user.histories.where(podcast_id: params[:id], episode_id: episode_ids)

    @episodes = histories.each_with_object(@episodes) do |history, (_, episodes)|
      episodes[history.episode_id].listened = history.listened
      episodes[history.episode_id].time = history.time
    end

    @pagy, @episodes = pagy_array(@episodes.values)
  end

  def listen
  end

  def subscribe
  end
end
