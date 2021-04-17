class Itunes
  # iTunes Search API:
  # https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/
  BASE_URL = "https://itunes.apple.com/".freeze

  # Returns search results matching term
  def self.search(term)
    query = { term: term, media: "podcast", country: "US" }.to_query
    url = BASE_URL + "search?" + query
    ApiResponse.cache(url, -> { 1.hour.ago }) do |res|
      results = JSON.parse(res.body)["results"]
      results.map { |item| process_podcast(item) }
    end
  end

  # Returns podcast with id
  def self.lookup(id)
    url = BASE_URL + "lookup?id=#{id}"
    ApiResponse.cache(url, -> { 1.hour.ago }) do |res|
      result = JSON.parse(res.body)["results"][0]
      process_podcast(result)
    end
  end

  # Returns top podcasts in the genre with genre_id
  def self.genre(genre_id, count = 50)
    # Undocumented search parameter genreId
    # https://stackoverflow.com/a/27883886/8660199
    query = {
      term: "podcast",
      genreId: genre_id,
      limit: count,
      country: "US",
    }.to_query
    url = BASE_URL + "search?" + query
    ApiResponse.cache(url, -> { 1.day.ago }) do |res|
      results = JSON.parse(res.body)["results"]
      results.map { |item| process_podcast(item) }
    end
  end

  # Returns top podcasts on iTunes
  def self.toplist(count = 50)
    rss =
      "https://rss.itunes.apple.com/api/v1/us/podcasts/top-podcasts/all/#{count}/explicit.json"

    ApiResponse.cache(rss, -> { 1.day.ago }) do |res|
      PreloadToplistJob.perform_later
      results = JSON.parse(res.body)["feed"]["results"]
      results.map do |podcast|
        {
          itunes_id: podcast["id"],
          name: podcast["name"],
          author: podcast["artistName"],
          genre: podcast["genres"][0]["name"],
          art600: podcast["artworkUrl100"], # Is actually 200x200px
        }
      end
    end
  end

  # Returns podcast object with properties accessible by dot notation
  def self.process_podcast(podcast)
    {
      itunes_id: podcast["collectionId"],
      name: podcast["collectionName"],
      author: podcast["artistName"],
      episode_count: podcast["trackCount"],
      genre: podcast["primaryGenreName"],
      genres: podcast["genres"] - ["Podcasts"],
      feed: podcast["feedUrl"],
      art100: podcast["artworkUrl100"],
      art600: podcast["artworkUrl600"],
    }
  end
end
