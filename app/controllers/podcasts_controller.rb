class PodcastsController < ApplicationController
  include Pagy::Backend

  def show
    @podcast = Itunes.lookup(params[:id])

    xml = ApiResponse.cache(@podcast.feed, -> { 1.hour.ago }) do
      Connect.get(@podcast.feed).body
    end

    feed = Feed.parse(xml)

    @podcast.description = feed[:description]

    @episodes = feed[:episodes].map { |episode| [episode.id, episode] }.to_h
    episode_ids = @episodes.each_with_object([]) do |(_, episode), ids|
      ids << episode.id
    end

    if user_signed_in?
      @subscribed = current_user.subscriptions
                                .where(itunes_id: params[:id]).any?

      histories = current_user.histories.where(podcast_id: params[:id],
                                               episode_id: episode_ids)

      @episodes = histories.each_with_object(@episodes) do |history, episodes|
        episodes[history.episode_id].listened = history.listened
        episodes[history.episode_id].time = history.time
      end
    end

    if params[:episode_id]
      return unless params[:episode_id]
      @modal_episode = @episodes[params[:episode_id]]
    end

    @pagy, @episodes = pagy_array(@episodes.values)
  end
end
