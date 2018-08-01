module PodcastHelper
  def process_podcast(podcast)
    OpenStruct.new(
      itunes_id: podcast.collectionId,
      name: podcast.collectionName,
      author: podcast.artistName,
      episode_count: podcast.trackCount,
      genre: podcast.primaryGenreName,
      genres: podcast.genres,
      feed: podcast.feedUrl,
      art100: podcast.artworkUrl100,
      art600: podcast.artworkUrl600
    )
  end

  def process_episodes(episodes)
    episodes.map do |episode|
      OpenStruct.new(
        title: sanitize(episode.title),
        podcast: @podcast.collectionName,
        description: sanitize(episode.description),
        duration: episode.itunes.duration,
        date: episode.pub_date,
        audio: episode.enclosure.url.to_s
      )
    end
  end

  def sanitize(input)
    ActionController::Base.helpers.sanitize(input)
  end
end
