class PreloadToplistJob < ApplicationJob
  queue_as :default

  # Fetch top podcasts from iTunes and preload episodes.
  def perform
    toplist = Itunes.toplist
    toplist.each do |top_podcast|
      podcast = Itunes.lookup(top_podcast.id)

      ApiResponse.cache(podcast.feed, -> { 1.day.ago }) do
        Connect.get(podcast.feed).body
      end
    end
  end
end
