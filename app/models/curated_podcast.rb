class CuratedPodcast < ApplicationRecord
  def self.all_podcasts
    all.each_with_object([]) do |podcast, array|
      array << Itunes.lookup(podcast.id)
    end
  end
end
