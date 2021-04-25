class CategoriesController < ApplicationController
  def show
    categories = Category.where(parent_id: nil)
    active_category = Category.find(params[:id])
    render locals: { categories: categories, active_category: active_category }
  end
end
