class CategoriesController < ApplicationController
  def index
    @categories = Category.where(parent_id: nil)
  end
  
  def show
    @categories = Category.where(parent_id: nil)
    @category = Category.find(params[:id])
  end
end
