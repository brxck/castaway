module ItunesHelper
  class Itunes
    def self.search(term)
      response = ITunesSearchAPI.search(term: term, media: "podcast", country: "US")
      response.map { |item| process_podcast(item) }
    end

    def self.lookup(id)
      response = ITunesSearchAPI.lookup(id: id)
      process_podcast(response)
    end

    def self.process_podcast(podcast)
      OpenStruct.new(
        itunes_id: podcast["collectionId"],
        name: podcast["collectionName"],
        author: podcast["artistName"],
        episode_count: podcast["trackCount"],
        genre: podcast["primaryGenreName"],
        genres: podcast["genres"] - ["Podcasts"],
        feed: podcast["feedUrl"],
        art100: podcast["artworkUrl100"],
        art600: podcast["artworkUrl600"]
      )
    end
  end
end
