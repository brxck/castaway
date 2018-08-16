class Itunes
  # iTunes Search API:
  # https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/

  BASE_URL = "https://itunes.apple.com/".freeze

  # Returns search results matching term
  def self.search(term)
    url = BASE_URL + "search?" +
          { term: term, media: "podcast", country: "US" }.to_query

    response = ApiResponse.cache(url, -> { 1.hour.ago }) do
      Connect.get(url).body
    end

    results = JSON.parse(response)["results"]
    results.map { |item| process_podcast(item) }
  end

  # Returns podcast with id
  def self.lookup(id)
    url = BASE_URL + "lookup?id=#{id}"
    response = ApiResponse.cache(url, -> { 1.hour.ago }) do
      Connect.get(url).body
    end

    result = JSON.parse(response)["results"][0]
    process_podcast(result)
  end

  # Returns top podcasts in the genre with genre_id
  def self.genre(genre_id, count = 50)
    # Undocumented search parameter genreId
    # https://stackoverflow.com/a/27883886/8660199
    url = BASE_URL + "search?" +
          { term: "podcast", genreId: genre_id, limit: count, country: "US" }.to_query

    response = ApiResponse.cache(url, -> { 1.day.ago }) do
      Connect.get(url).body
    end

    results = JSON.parse(response)["results"]
    results.map { |item| process_podcast(item) }
  end

  # Returns top podcasts on iTunes
  def self.toplist(count = 50)   
    rss = "https://rss.itunes.apple.com/api/v1/us/podcasts/top-podcasts/all/#{count}/explicit.json"

    feed = ApiResponse.cache(rss, -> { 1.day.ago }) do
      PreloadToplistJob.perform_later
      Connect.get(rss).body
    end

    results = JSON.parse(feed)["feed"]["results"]

    results.map do |podcast|
      OpenStruct.new(
        itunes_id: podcast["id"],
        name: podcast["name"],
        author: podcast["artistName"],
        genre: podcast["genres"][0]["name"],
        art600: podcast["artworkUrl100"] # Is actually 200x200px
      )
    end
  end

  # Returns podcast object with properties accessible by dot notation
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
