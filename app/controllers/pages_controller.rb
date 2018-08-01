class PagesController < ApplicationController
  include ItunesHelper
  include Pagy::Backend
  
  def home
  end

  def discover
    rss = "https://rss.itunes.apple.com/api/v1/us/podcasts/top-podcasts/all/10/explicit.json?at=10l9W2"
    results = Connect.get(rss).body["feed"]["results"]

    @toplist = results.map do |podcast|
      OpenStruct.new(
        itunes_id: podcast["id"],
        name: podcast["name"],
        art100: podcast["artworkUrl100"],
        art600: podcast["artworkUrl600"]
      )
    end
  end

  def search
    @results = Itunes.search(params[:q])
    @pagy, @results = pagy_array(@results)
  end
end
