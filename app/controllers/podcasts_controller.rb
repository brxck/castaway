class PodcastsController < ApplicationController
  include Pagy::Backend

  # This controller gets messy because we are integrating data from several sources on request.  
  
  def show
    @podcast = Itunes.lookup(params[:id])

    feed_xml = ApiResponse.cache(@podcast.feed, -> { 1.hour.ago }) do
      Connect.get(@podcast.feed).body
    end
    feed = Feed.parse(feed_xml)

    # Grab description from feed because it's not included in iTunes look up
    @podcast.description = feed[:description]

    # Create { episode_id: episode } hash to integrate with history data
    @episodes = feed[:episodes].map { |episode| [episode.id, episode] }.to_h
    episode_ids = @episodes.each_with_object([]) do |(_, episode), ids|
      ids << episode.id
    end

    # Integrate user history with episode list
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

    # Handle episode and sort parameters
    @modal_episode = @episodes[params[:episode_id]] if params[:episode_id]
    @episodes = @episodes.reverse_each.to_h if params[:order] == "up"

    @pagy, @episodes = pagy_array(@episodes.values)
  end
end
