class CuratedPodcast < ApplicationRecord
  def self.all_podcasts
    all.map { |podcast| Itunes.lookup(podcast.id) }
  end
end
