class PagesController < ApplicationController
  include ItunesHelper
  include Pagy::Backend
  
  def home
  end

  def discover
    rss = "https://rss.itunes.apple.com/api/v1/us/podcasts/top-podcasts/all/25/explicit.json"

    results = Rails.cache.fetch("toplist", expires_in: 1.day) do
      Connect.get(rss).body["feed"]["results"]
    end

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
