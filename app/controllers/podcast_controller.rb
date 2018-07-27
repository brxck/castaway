class PodcastController < ApplicationController
  include ItunesHelper
  include FeedHelper
  include Pagy::Backend

  def show
    raw_podcast = Itunes.lookup(params[:id])

    xml = Connect.get(raw_podcast.feedUrl).body
    feed = Feed.parse(xml)

    @podcast = process_podcast(raw_podcast)
    @podcast.description = sanitize(feed.description)

    episodes = process_episodes(feed.rss.channel.items)
    @pagy, @episodes = pagy_array(episodes)
  end

  def listen
  end

  def subscribe
  end

  private

  def process_podcast(podcast)
    OpenStruct.new(
      name: podcast.collectionName,
      art: podcast.artworkUrl,
      art100: podcast.artworkUrl100,
      episode_count: podcast.trackCount,
      genre: podcast.primaryGenreName,
      feed: podcast.feedUrl
    )
  end

  def process_episodes(episodes)
    episodes.map do |episode|
      OpenStruct.new(
        title: sanitize(episode.title),
        podcast: @podcast.collectionName,
        description: sanitize(episode.description),
        date: episode.pub_date.strftime("%Y %b %-d"),
        audio: episode.enclosure.url.to_s
      )
    end
  end

  def sanitize(input)
    ActionController::Base.helpers.sanitize(input)
  end
end
