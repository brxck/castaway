class PodcastsController < ApplicationController
  include Pagy::Backend

  def show
    podcast =
      Rails
        .cache
        .fetch("show-podcast-#{params[:id]}") do
          podcast = Itunes.lookup(params[:id])
          podcast.fetch_episodes
        end

    if user_signed_in?
      podcast.add_history(current_user)
      subscribed = current_user.subscriptions.where(id: params[:id]).any?
    end

    modal_episode = podcast.episodes[params[:episode_id]] if params[:episode_id]
    podcast.reverse_episodes if params[:order] == "up"
    pagy, episodes = pagy_array(podcast.episodes.values)
    render locals: {
             podcast: podcast,
             episodes: episodes,
             modal_episode: modal_episode,
             subscribed: subscribed,
             pagy: pagy,
           }
  end

  def new_episodes
    cached = Rails.cache.read("show-podcast-#{params[:id]}")
    fresh =
      Rails
        .cache
        .fetch("show-podcast-#{params[:id]}", { force: true }) do
          podcast = Itunes.lookup(params[:id])
          podcast.fetch_episodes
        end
    count = fresh.episodes.length - cached.episodes.length if cached
    render status: :ok, json: { episodes: count }
  end
end
