class PagesController < ApplicationController
  def home
    
  end

  def discover
    rss = "https://rss.itunes.apple.com/api/v1/us/podcasts/top-podcasts/all/10/explicit.json?at=10l9W2"
    results = Connect.get(rss).body["feed"]["results"]

    @toplist = results.map { |podcast| OpenStruct.new(podcast) }
  end

  def search

  end
end
