class PagesController < ApplicationController
  include Pagy::Backend

  def discover
    rss = "https://rss.itunes.apple.com/api/v1/us/podcasts/top-podcasts/all/25/explicit.json"

    feed = ApiResponse.cache(rss, -> { 1.day.ago }) do
      Connect.get(rss).body
    end

    results = JSON.parse(feed)["feed"]["results"]

    @toplist = results.map do |podcast|
      OpenStruct.new(
        itunes_id: podcast["id"],
        name: podcast["name"],
        author: podcast["artistName"],
        genre: podcast["genres"][0]["name"],
        art600: podcast["artworkUrl100"] # Is actually 200x200px
      )
    end
  end

  def search
    @term = params[:q]
    @results = Itunes.search(params[:q])
    @pagy, @results = pagy_array(@results)
  end
end
