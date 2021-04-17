class PodcastsController < ApplicationController
  include Pagy::Backend

  def show
    @podcast = Itunes.lookup(params[:id])
    feed =
      ApiResponse.cache(@podcast["feed"], -> { 15.minutes.ago }) do |res|
        Feed.parse(res.body)
      end

    # Grab description from feed because it's not included in iTunes look up
    @podcast[:description] = feed[:description]

    if user_signed_in?
      @episodes = Episode.with_histories(feed)
      @subscribed =
        current_user.subscriptions.where(itunes_id: params[:id]).any?
    else
      @episodes = Episode.from_feed(feed)
    end

    # Handle episode and sort parameters
    @modal_episode = @episodes[params[:episode_id]] if params[:episode_id]
    @episodes = @episodes.reverse_each.to_h if params[:order] == "up"

    @pagy, @episodes = pagy_array(@episodes.values)
  end
end
