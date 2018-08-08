class CacheToplistJob < ApplicationJob
  queue_as :default

  def perform(*toplist)
    toplist.each do |top_podcast|
      # OpenStructs have been converted to hashes for serialization
      podcast = Itunes.lookup(top_podcast[:itunes_id])

      ApiResponse.cache(podcast.feed, -> { 1.day.ago }) do
        Connect.get(podcast.feed).body
      end
    end
  end
end
