class PagesController < ApplicationController
  include Pagy::Backend

  def discover
    @toplist = Itunes.toplist(8)
    @categories = Category.where(parent_id: nil)
    @curated = CuratedPodcast.all_podcasts

    # Pick random category
    @category = Category.find(Category.where(parent_id: nil).pluck(:id).sample)
  end

  def popular
    @toplist = Itunes.toplist(50)
    @categories = Category.where(parent_id: nil)
  end

  def search
    @term = params[:q]
    @results = Itunes.search(params[:q])
    @pagy, @results = pagy_array(@results)
  end

  private

  def preload(*groups)
    groups.each do |group|
      PreloadToplistJob.perform_later(group.map(&:to_h))
    end
  end
end
