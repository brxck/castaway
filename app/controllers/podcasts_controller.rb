class PodcastsController < ApplicationController
  include Pagy::Backend

  def show
    podcast, feed =
      Rails
        .cache
        .fetch("show-podcast-#{params[:id]}") do
          podcast = Itunes.lookup(params[:id])
          feed = Connect.get(podcast[:feed])
          feed = Feed.parse(feed.body)
          podcast[:description] = feed[:description]
          [podcast, feed]
        end

    if user_signed_in?
      episodes = Episode.with_histories(feed)
      subscribed = current_user.subscriptions.where(itunes_id: params[:id]).any?
    else
      episodes = Episode.from_feed(feed)
    end

    # Handle episode and sort parameters
    modal_episode = episodes[params[:episode_id]] if params[:episode_id]
    episodes = episodes.reverse_each.to_h if params[:order] == "up"

    pagy, episodes = pagy_array(episodes.values)
    render locals: {
             podcast: podcast,
             episodes: episodes,
             modal_episode: modal_episode,
             subscribed: subscribed,
             pagy: pagy,
           }
  end

  def new_episodes
    _, old_feed = Rails.cache.read("show-podcast-#{params[:id]}")
    _, feed =
      Rails
        .cache
        .fetch("show-podcast-#{params[:id]}", { force: true }) do
          podcast = Itunes.lookup(params[:id])
          feed = Connect.get(podcast[:feed])
          feed = Feed.parse(feed.body)
          podcast[:description] = feed[:description]
          [podcast, feed]
        end
    count = feed[:episodes].length - old_feed[:episodes].length
    render status: :ok, json: { episodes: count }
  end
end
