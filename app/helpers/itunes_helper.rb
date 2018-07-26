module ItunesHelper
  class Itunes
    def self.search(term)
      response = ITunesSearchAPI.search(term: term, media: "podcast", country: "US")
      response.map { |item| OpenStruct.new(item) }
    end

    def self.lookup(id)
      response = ITunesSearchAPI.lookup(id: id)
      OpenStruct.new(response)
    end
  end
end
