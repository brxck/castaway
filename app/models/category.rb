class Category < ApplicationRecord
  belongs_to :category, foreign_key: "parent_id", optional: true
  has_many :subcategories, class_name: "Category", foreign_key: "parent_id"

  def podcasts(count = 50)
    Itunes.genre(id, count)
  end

  def to_partial_path
    "categories/category"
  end
end
