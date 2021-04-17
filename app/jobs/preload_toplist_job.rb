class PreloadToplistJob < ApplicationJob
  queue_as :default

  # Fetch top podcasts from iTunes and preload episodes.
  def perform
    rss =
      "https://rss.itunes.apple.com/api/v1/us/podcasts/top-podcasts/all/50/explicit.json"
    feed = Connect.get(rss).body
    results = JSON.parse(feed)["feed"]["results"]

    results.each do |result|
      podcast = Itunes.lookup(result["id"])
      ApiResponse.cache(podcast.feed, -> { 1.day.ago })
    end
  end
end
