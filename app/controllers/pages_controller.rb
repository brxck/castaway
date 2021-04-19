class PagesController < ApplicationController
  include Pagy::Backend

  def discover
    data =
      Rails
        .cache
        .fetch("discover", expires_in: 24.hours) do
          {
            toplist: Itunes.toplist(12),
            curated: CuratedPodcast.all_podcasts,
            categories: Category.where(parent_id: nil).includes(:subcategories),
            category:
              Category.find(Category.where(parent_id: nil).pluck(:id).sample),
          }
        end
    render locals: data
  end

  def popular
    data =
      Rails
        .cache
        .fetch("popular", expires_in: 24.hours) do
          {
            toplist: Itunes.toplist(50),
            categories: Category.where(parent_id: nil).includes(:subcategories),
          }
        end
    render locals: data
  end

  def search
    data =
      Rails
        .cache
        .fetch("search-" + params[:q], expires_in: 1.hour) do
          results = Itunes.search(params[:q])
          pagy, results = pagy_array(results)
          { pagy: pagy, results: results, term: params[:q] }
        end
    render locals: data
  end
end
