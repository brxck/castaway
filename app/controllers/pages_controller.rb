class PagesController < ApplicationController
  include Pagy::Backend

  def discover
    set_toplist(8)
    @categories = Category.where(parent_id: nil)

    @curated = CuratedPodcast.all.each_with_object([]) do |podcast, array|
      array << Itunes.lookup(podcast.id)
    end

    # Pick random category
    @category = Category.find(Category.where(parent_id: nil).pluck(:id).sample)
  end

  def popular
    set_toplist(50)
    @categories = Category.where(parent_id: nil)
  end

  def search
    @term = params[:q]
    @results = Itunes.search(params[:q])
    @pagy, @results = pagy_array(@results)
  end

  private

  def set_toplist(count)
    cached = true
    rss = "https://rss.itunes.apple.com/api/v1/us/podcasts/top-podcasts/all/#{count}/explicit.json"

    feed = ApiResponse.cache(rss, -> { 1.day.ago }) do
      cached = false
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
    
    CacheToplistJob.perform_later(@toplist.map(&:to_h)) unless cached
  end
end
