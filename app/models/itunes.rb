class Itunes
  BASE_URL = "https://itunes.apple.com/".freeze

  def self.search(term)
    url = BASE_URL + "search?" +
          { term: term, media: "podcast", country: "US" }.to_query

    response = ApiResponse.cache(url, -> { 1.hour.ago }) do
      Connect.get(url).body
    end

    results = JSON.parse(response)["results"]
    results.map { |item| process_podcast(item) }
  end

  def self.lookup(id)
    url = BASE_URL + "lookup?id=#{id}"
    response = ApiResponse.cache(url, -> { 1.hour.ago }) do
      Connect.get(url).body
    end

    result = JSON.parse(response)["results"][0]
    process_podcast(result)
  end

  def self.genre(genre_id)
    url = BASE_URL + "search?" +
          { term: "podcast", genreId: genre_id, country: "US" }.to_query

    response = ApiResponse.cache(url, -> { 1.day.ago }) do
      Connect.get(url).body
    end

    results = JSON.parse(response)["results"]
    results.map { |item| process_podcast(item) }
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
