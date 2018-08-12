class CategoriesController < ApplicationController
  def show
    @categories = Category.where(parent_id: nil)
    @category = Category.find(params[:id])
  end
end
